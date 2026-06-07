/**
 * Dialogue Manager (.dialogue) Parser for JavaScript
 * Converts Godot Dialogue Manager format to our Visual Novel Engine format.
 *
 * Usage:
 *   const parser = new DialogueParser();
 *   const gameData = parser.parse(dialogueText);
 *   // gameData can be merged into GAME_DATA.timeline
 *
 * Supported features:
 *   - Character: dialogue lines
 *   - - Response options (nested via indentation)
 *   - ~ Cues (labels)
 *   - => Jumps (goto/end)
 *   - if/elif/else conditions
 *   - [if condition /] on responses
 *   - $> Mutations (set_variable)
 *   - % Random lines (simplified to first option)
 *   - import statements
 *   - {{variable}} interpolation
 *   - [#tags] annotation
 *   - Comments (# or //)
 */

class DialogueParser {
  constructor(options = {}) {
    this.options = {
      defaultCharacter: 'narrator',
      logWarnings: true,
      ...options
    };
    this.lines = [];
    this.index = 0;
    this.events = [];
    this.labels = {};
    this.variables = {};
    this.lineNumber = 0;
    this.imports = {};
  }

  /**
   * Parse dialogue text into visual novel events
   */
  parse(text) {
    this.events = [];
    this.labels = {};
    this.variables = {};
    this.lines = text.split('\n');
    this.index = 0;
    this.lineNumber = 0;

    // Parse lines
    while (this.index < this.lines.length) {
      this.parseLine();
    }

    return this.buildGameData();
  }

  /**
   * Parse a single line and its indented children
   */
  parseLine(baseIndent = -1) {
    if (this.index >= this.lines.length) return null;

    const rawLine = this.lines[this.index];
    this.lineNumber = this.index + 1;
    const indent = this.getIndent(rawLine);
    const line = rawLine.trim();

    // If indent is less than base, we're done with this block
    if (baseIndent >= 0 && indent <= baseIndent && line !== '') {
      return null;
    }

    this.index++;

    // Skip empty lines and comments
    if (line === '' || line.startsWith('#') || line.startsWith('//')) {
      return this.parseLine(baseIndent);
    }

    // --- import ---
    if (line.startsWith('import ')) {
      const match = line.match(/^import\s+"([^"]+)"(?:\s+as\s+(\w+))?/);
      if (match) {
        this.imports[match[2] || match[1]] = match[1];
      }
      return this.parseLine(baseIndent);
    }

    // --- using ---
    if (line.startsWith('using ')) {
      return this.parseLine(baseIndent);
    }

    // --- Cue/Label ---
    if (line.startsWith('~ ')) {
      const cueName = line.substring(2).trim();
      const ev = { type: 'label', id: cueName };
      this.events.push(ev);
      this.labels[cueName] = this.events.length - 1;

      // Parse children (lines with greater indent)
      while (this.index < this.lines.length) {
        const nextIndent = this.getIndent(this.lines[this.index]);
        const nextLine = this.lines[this.index].trim();
        if (nextLine === '' || nextIndent <= indent) break;
        this.parseLine(indent);
      }
      return ev;
    }

    // --- Jump/Goto ---
    if (line.startsWith('=> ')) {
      const target = line.substring(3).trim();
      if (target === 'END' || target === 'END!') {
        this.events.push({ type: 'end' });
      } else {
        this.events.push({ type: 'goto', goto_id: target });
      }
      return this.events[this.events.length - 1];
    }

    // Jump and return (=><)
    if (line.startsWith('=>< ')) {
      const target = line.substring(4).trim();
      // Simplified: treat as regular jump (no return stack in basic engine)
      this.events.push({ type: 'goto', goto_id: target });
      return this.events[this.events.length - 1];
    }

    // --- Mutation ($>) ---
    if (line.startsWith('$> ')) {
      const mutation = line.substring(3).trim();
      const ev = this.parseMutation(mutation);
      if (ev) this.events.push(ev);
      return ev;
    }

    // --- Condition (if/elif/else) ---
    if (line.match(/^(if|elif|else)\s/)) {
      return this.parseConditionBlock(line, indent);
    }

    // Match statement
    if (line.startsWith('match ')) {
      return this.parseMatchBlock(line, indent);
    }

    // While loop
    if (line.startsWith('while ')) {
      return this.parseWhileBlock(line, indent);
    }

    // --- Random (%) ---
    if (line.startsWith('%')) {
      // Simplified: just use the first random line
      const cleanLine = line.replace(/^%\d*\s*/, '');
      if (cleanLine.startsWith('=> ')) {
        return this.parseLine(baseIndent); // Handle jump inside random
      }
      // Re-parse as regular line
      const savedIndex = this.index - 1;
      this.lines[savedIndex] = ' '.repeat(indent) + cleanLine;
      this.index = savedIndex;
      return this.parseLine(baseIndent);
    }

    // --- Response ---
    if (line.startsWith('- ')) {
      return this.parseResponseBlock(line, indent);
    }

    // --- Concurrent line (|) ---
    if (line.startsWith('| ')) {
      // Simplified: treat as regular dialogue
      return this.parseDialogueLine(line.substring(2).trim());
    }

    // --- Regular dialogue ---
    return this.parseDialogueLine(line);
  }

  /**
   * Parse dialogue line: "Character: text" or just "text"
   */
  parseDialogueLine(line) {
    const match = line.match(/^(?:\[([^\]]*)\]\s*)?(?:(\S+)\s*:\s*)?(.+)$/);
    if (!match) return null;

    let [, tags, character, text] = match;

    // Handle {{variable}} interpolation placeholder
    text = text.replace(/\{\{([^}]+)\}\}/g, '{$1}');

    // Handle [if]...[/if] inline conditions - simplified
    text = text.replace(/\[if\s+([^\]]+)\](.*?)\[\/if\]/g, '$2');
    text = text.replace(/\[else\](.*?)\[\/if\]/g, '');

    // Handle [wait=N] and other inline tags - strip for now
    text = text.replace(/\[wait[^\]]*\]/g, '');
    text = text.replace(/\[speed[^\]]*\]/g, '');
    text = text.replace(/\[next[^\]]*\]/g, '');
    text = text.replace(/\[\$>[^\]]*\]/g, '');

    // Map character name to id
    const charId = character ? this.mapCharacterId(character) : this.options.defaultCharacter;

    const ev = {
      type: 'text',
      character: charId,
      text: text.trim()
    };

    // Handle tags
    if (tags) {
      ev.tags = tags.split(',').map(t => t.trim().replace(/^#/, ''));
    }

    this.events.push(ev);
    return ev;
  }

  /**
   * Parse response block (choices)
   */
  parseResponseBlock(line, indent) {
    // Collect all responses at this indent level
    const choices = [];
    const responseStartIndex = this.index - 1; // We've already incremented

    // First response (the one we're on)
    choices.push(line);

    // Gather sibling responses
    while (this.index < this.lines.length) {
      const nextIndent = this.getIndent(this.lines[this.index]);
      const nextLine = this.lines[this.index].trim();
      if (nextLine === '') {
        this.index++;
        continue;
      }
      if (nextIndent < indent) break;
      if (nextIndent === indent && nextLine.startsWith('- ')) {
        choices.push(nextLine);
        this.index++;
      } else if (nextIndent > indent) {
        // This is nested content of the last response
        break;
      } else {
        break;
      }
    }

    // Now parse each choice
    const parsedChoices = [];

    // Reset to process each choice's nested content
    // We need to re-process the block
    const savedIndex = this.index;
    this.index = responseStartIndex;

    for (const choiceLine of choices) {
      this.index++; // Skip the choice line itself
      const parsed = this.parseChoiceLine(choiceLine);

      // Collect nested events for this choice
      const nestedStart = this.events.length;
      while (this.index < this.lines.length) {
        const nextIndent = this.getIndent(this.lines[this.index]);
        const nextLine = this.lines[this.index].trim();
        if (nextLine === '') { this.index++; continue; }
        if (nextIndent <= indent) break;
        this.parseLine(indent);
      }
      const nestedEvents = this.events.splice(nestedStart);

      // Find the goto target from nested events
      let gotoId = null;
      for (const ev of nestedEvents) {
        if (ev.type === 'goto') { gotoId = ev.goto_id; break; }
        if (ev.type === 'end') { gotoId = '__END__'; break; }
      }

      if (gotoId === '__END__') {
        // This choice leads to end
        parsedChoices.push({
          text: parsed.text,
          goto_id: parsed.goto_id || '__END__'
        });
      } else if (gotoId) {
        parsedChoices.push({
          text: parsed.text,
          goto_id: gotoId,
          condition: parsed.condition,
          set_variables: parsed.set_variables
        });
      } else if (parsed.goto_id) {
        parsedChoices.push({
          text: parsed.text,
          goto_id: parsed.goto_id,
          condition: parsed.condition,
          set_variables: parsed.set_variables
        });
      } else {
        // No explicit goto - create one from nested content
        const labelName = '_choice_' + this.events.length;
        this.events.push({ type: 'label', id: labelName });
        this.events.push(...nestedEvents);
        parsedChoices.push({
          text: parsed.text,
          goto_id: labelName,
          condition: parsed.condition,
          set_variables: parsed.set_variables
        });
      }
    }

    this.events.push({
      type: 'choice',
      text: '',
      choices: parsedChoices
    });

    return null;
  }

  /**
   * Parse a single choice line: "- text [if condition /] => target"
   */
  parseChoiceLine(line) {
    let text = line.substring(2).trim();
    let condition = null;
    let gotoId = null;
    let setVariables = null;

    // Extract goto: => target
    const gotoMatch = text.match(/\s*=>\s*(\S+)\s*$/);
    if (gotoMatch) {
      gotoId = gotoMatch[1];
      text = text.substring(0, text.lastIndexOf('=>')).trim();
    }

    // Extract condition: [if condition /]
    const condMatch = text.match(/\[if\s+(.+?)\s+\/\]\s*$/);
    if (condMatch) {
      condition = this.parseConditionExpression(condMatch[1]);
      text = text.substring(0, text.lastIndexOf('[if')).trim();
    }

    return { text, condition, goto_id: gotoId, set_variables: setVariables };
  }

  /**
   * Parse condition block (if/elif/else)
   */
  parseConditionBlock(line, indent) {
    const ifMatch = line.match(/^(if|elif|else)\s+(.+)$/);
    const elseMatch = line.match(/^(else)\s*$/);

    let condition = null;
    let blockType = 'if';

    if (ifMatch) {
      blockType = ifMatch[1];
      condition = this.parseConditionExpression(ifMatch[2]);
    } else if (elseMatch) {
      blockType = 'else';
    }

    // Collect nested events
    const blockStart = this.events.length;
    while (this.index < this.lines.length) {
      const nextIndent = this.getIndent(this.lines[this.index]);
      const nextLine = this.lines[this.index].trim();
      if (nextLine === '') { this.index++; continue; }
      if (nextIndent <= indent) break;

      // Check for elif/else at same indent
      if (nextIndent === indent && nextLine.match(/^(elif|else)/)) {
        break;
      }

      this.parseLine(indent);
    }

    const blockEvents = this.events.splice(blockStart);

    // Create condition event
    if (blockType === 'if') {
      const labelThen = '_if_true_' + this.events.length;
      const labelElse = '_if_false_' + this.events.length;
      const labelEnd = '_if_end_' + this.events.length;

      this.events.push({
        type: 'condition',
        conditions: [condition],
        then_goto: labelThen,
        else_goto: labelElse
      });

      this.events.push({ type: 'label', id: labelThen });
      this.events.push(...blockEvents);
      this.events.push({ type: 'goto', goto_id: labelEnd });
      this.events.push({ type: 'label', id: labelElse });
      // else block (processed next if elif/else follows)
      this.events.push({ type: 'label', id: labelEnd });
    } else if (blockType === 'elif') {
      // Already inside if block, handled by the if logic
      this.events.push(...blockEvents);
    } else {
      // else
      this.events.push(...blockEvents);
    }

    // Check for following elif/else at same level
    if (this.index < this.lines.length) {
      const nextLine = this.lines[this.index].trim();
      if (nextLine.match(/^(elif|else)/)) {
        this.parseLine(indent);
      }
    }

    return null;
  }

  /**
   * Parse match block (simplified to if/elif chain)
   */
  parseMatchBlock(line, indent) {
    const matchExpr = line.substring(6).trim();
    const events = [];

    while (this.index < this.lines.length) {
      const nextIndent = this.getIndent(this.lines[this.index]);
      const nextLine = this.lines[this.index].trim();
      if (nextLine === '') { this.index++; continue; }
      if (nextIndent <= indent) break;

      if (nextLine.startsWith('when ')) {
        // Handle when - simplified
        this.index++;
        while (this.index < this.lines.length) {
          const innerIndent = this.getIndent(this.lines[this.index]);
          if (innerIndent <= nextIndent) break;
          this.parseLine(nextIndent);
        }
      } else if (nextLine.startsWith('else')) {
        this.index++;
        while (this.index < this.lines.length) {
          const innerIndent = this.getIndent(this.lines[this.index]);
          if (innerIndent <= nextIndent) break;
          this.parseLine(nextIndent);
        }
      } else {
        break;
      }
    }
    return null;
  }

  /**
   * Parse while loop (simplified to single iteration)
   */
  parseWhileBlock(line, indent) {
    // Simplified: parse body once
    while (this.index < this.lines.length) {
      const nextIndent = this.getIndent(this.lines[this.index]);
      const nextLine = this.lines[this.index].trim();
      if (nextLine === '') { this.index++; continue; }
      if (nextIndent <= indent) break;
      this.parseLine(indent);
    }
    return null;
  }

  /**
   * Parse mutation line: "$> something = value"
   */
  parseMutation(mutation) {
    // Variable assignment: something = value
    const assignMatch = mutation.match(/^(\S+)\s*=\s*(.+)$/);
    if (assignMatch) {
      const name = assignMatch[1];
      let value = assignMatch[2].trim();

      // Try to parse as number
      if (/^-?\d+(\.\d+)?$/.test(value)) {
        value = parseFloat(value);
      } else if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else {
        // String - remove quotes
        value = value.replace(/^["']|["']$/g, '');
      }

      // Check for += operation
      const incMatch = mutation.match(/^(\S+)\s*\+=\s*(.+)$/);
      if (incMatch) {
        return {
          type: 'set_variable',
          set: [{ name: incMatch[1], value: parseFloat(incMatch[2]) || incMatch[2], operation: '+=' }]
        };
      }

      return {
        type: 'set_variable',
        set: [{ name: name, value: value, operation: '=' }]
      };
    }

    // Method call - ignore in basic engine
    return null;
  }

  /**
   * Parse condition expression into our format
   */
  parseConditionExpression(expr) {
    expr = expr.trim();

    // Remove outer parentheses
    if (expr.startsWith('(') && expr.endsWith(')')) {
      expr = expr.slice(1, -1).trim();
    }

    // Handle "not" prefix
    if (expr.startsWith('not ')) {
      const inner = this.parseConditionExpression(expr.substring(4));
      // Invert comparison
      const inverted = { ...inner };
      if (inverted.comparison === '==') inverted.comparison = '!=';
      else if (inverted.comparison === '!=') inverted.comparison = '==';
      else if (inverted.comparison === '>') inverted.comparison = '<=';
      else if (inverted.comparison === '<') inverted.comparison = '>=';
      else if (inverted.comparison === '>=') inverted.comparison = '<';
      else if (inverted.comparison === '<=') inverted.comparison = '>';
      return inverted;
    }

    // Comparison: name op value
    const compMatch = expr.match(/^(\S+)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
    if (compMatch) {
      let value = compMatch[3].trim();
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (/^-?\d+(\.\d+)?$/.test(value)) value = parseFloat(value);
      else value = value.replace(/^["']|["']$/g, '');

      return {
        name: compMatch[1],
        value: value,
        comparison: compMatch[2]
      };
    }

    // Simple boolean check: name (treated as == true)
    if (/^\w+$/.test(expr)) {
      return { name: expr, value: true, comparison: '==' };
    }

    return { name: expr, value: true, comparison: '==' };
  }

  /**
   * Get indentation level of a line
   */
  getIndent(line) {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
  }

  /**
   * Map character display name to id
   */
  mapCharacterId(name) {
    const map = {
      'Nathan': 'advisor',
      '陈老师': 'advisor',
      'advisor': 'advisor',
      '王离谱': 'wang',
      'Wang': 'wang',
      'wang': 'wang',
      '李思然': 'lisiran',
      'Lisiran': 'lisiran',
      'lisiran': 'lisiran',
      'narrator': 'narrator',
      '系统': 'narrator',
      '室友': 'roommate',
      'roommate': 'roommate'
    };
    return map[name] || name.toLowerCase().replace(/\s+/g, '_');
  }

  /**
   * Build final game data structure
   */
  buildGameData() {
    return {
      metadata: {
        version: '2.0',
        name: 'Dialogue Manager Import',
        author: 'Imported from .dialogue',
        description: 'Converted from Godot Dialogue Manager format'
      },
      characters: [
        { id: 'advisor', display_name: '陈老师', default_portrait: '', color: '#ffffff' },
        { id: 'wang', display_name: '王离谱', default_portrait: '', color: '#ffcc88' },
        { id: 'lisiran', display_name: '李思然', default_portrait: '', color: '#aaddff' },
        { id: 'narrator', display_name: '系统', default_portrait: '', color: '#aaaaaa' },
        { id: 'roommate', display_name: '室友', default_portrait: '', color: '#99cc99' }
      ],
      initialVariables: this.variables,
      timeline: this.events
    };
  }
}

// Export for browser use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DialogueParser;
}
