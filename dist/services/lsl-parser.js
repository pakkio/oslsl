"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LSLParser = void 0;
class LSLParser {
    static LSL_KEYWORDS = [
        'if', 'else', 'for', 'while', 'do', 'state', 'default', 'jump', 'return',
        'integer', 'float', 'string', 'key', 'vector', 'rotation', 'list',
        'TRUE', 'FALSE', 'NULL_KEY', 'EOF', 'AGENT', 'ACTIVE', 'PASSIVE',
        'SCRIPTED', 'CONTROL_FWD', 'CONTROL_BACK', 'CONTROL_LEFT', 'CONTROL_RIGHT'
    ];
    static LSL_FUNCTIONS = [
        'llSay', 'llWhisper', 'llShout', 'llListen', 'llSensor', 'llSetText',
        'llOwnerSay', 'llRegionSay', 'llGetOwner', 'llGetPos', 'llSetPos',
        'llGetRot', 'llSetRot', 'llGetVel', 'llSetVelocity', 'llApplyImpulse'
    ];
    static LSL_EVENTS = [
        'state_entry', 'state_exit', 'touch_start', 'touch_end', 'collision_start',
        'collision_end', 'timer', 'listen', 'sensor', 'no_sensor', 'at_target',
        'not_at_target', 'at_rot_target', 'not_at_rot_target', 'money', 'email',
        'run_time_permissions', 'changed', 'attach', 'dataserver', 'moving_end',
        'moving_start', 'object_rez', 'remote_data', 'http_response', 'http_request'
    ];
    static tokenize(code) {
        const tokens = [];
        let position = 0;
        let i = 0;
        while (i < code.length) {
            const char = code[i];
            // Skip whitespace
            if (/\s/.test(char)) {
                const start = i;
                while (i < code.length && /\s/.test(code[i]))
                    i++;
                tokens.push({
                    type: 'whitespace',
                    value: code.substring(start, i),
                    position: start
                });
                continue;
            }
            // Comments
            if (char === '/' && code[i + 1] === '/') {
                const start = i;
                while (i < code.length && code[i] !== '\n')
                    i++;
                tokens.push({
                    type: 'comment',
                    value: code.substring(start, i),
                    position: start
                });
                continue;
            }
            if (char === '/' && code[i + 1] === '*') {
                const start = i;
                i += 2;
                while (i < code.length - 1 && !(code[i] === '*' && code[i + 1] === '/'))
                    i++;
                i += 2;
                tokens.push({
                    type: 'comment',
                    value: code.substring(start, i),
                    position: start
                });
                continue;
            }
            // Strings
            if (char === '"') {
                const start = i;
                i++; // Skip opening quote
                while (i < code.length && code[i] !== '"') {
                    if (code[i] === '\\')
                        i++; // Skip escaped character
                    i++;
                }
                i++; // Skip closing quote
                tokens.push({
                    type: 'string',
                    value: code.substring(start, i),
                    position: start
                });
                continue;
            }
            // Numbers
            if (/\d/.test(char) || (char === '.' && /\d/.test(code[i + 1]))) {
                const start = i;
                while (i < code.length && /[\d.]/.test(code[i]))
                    i++;
                tokens.push({
                    type: 'number',
                    value: code.substring(start, i),
                    position: start
                });
                continue;
            }
            // Identifiers and keywords
            if (/[a-zA-Z_]/.test(char)) {
                const start = i;
                while (i < code.length && /[a-zA-Z0-9_]/.test(code[i]))
                    i++;
                const value = code.substring(start, i);
                const type = this.LSL_KEYWORDS.includes(value) ? 'keyword' :
                    this.LSL_FUNCTIONS.includes(value) ? 'function' : 'variable';
                tokens.push({
                    type,
                    value,
                    position: start
                });
                continue;
            }
            // Operators and punctuation
            const start = i;
            i++;
            tokens.push({
                type: 'operator',
                value: char,
                position: start
            });
        }
        return tokens;
    }
    static validateLSLCode(code) {
        const tokens = this.tokenize(code);
        const errors = [];
        const warnings = [];
        // Check for basic LSL structure
        const hasStateEntry = tokens.some(t => t.value === 'state_entry');
        const hasDefaultState = tokens.some(t => t.value === 'default');
        if (!hasDefaultState) {
            errors.push('Missing default state');
        }
        // Check for balanced braces
        let braceCount = 0;
        for (const token of tokens) {
            if (token.value === '{')
                braceCount++;
            if (token.value === '}')
                braceCount--;
            if (braceCount < 0) {
                errors.push(`Unmatched closing brace at position ${token.position}`);
            }
        }
        if (braceCount > 0) {
            errors.push('Unmatched opening brace');
        }
        // Check for PHP/HTML contamination
        const hasPHPTags = code.includes('<?php') || code.includes('<?=');
        const hasHTMLTags = /<[a-zA-Z][^>]*>/.test(code);
        const hasMediaWikiSyntax = /\{\{.*\}\}/.test(code) || /\[\[.*\]\]/.test(code);
        if (hasPHPTags) {
            errors.push('PHP code detected - not valid LSL');
        }
        if (hasHTMLTags) {
            errors.push('HTML tags detected - not valid LSL');
        }
        if (hasMediaWikiSyntax) {
            errors.push('MediaWiki syntax detected - not valid LSL');
        }
        // Calculate confidence based on LSL-specific patterns
        let confidence = 0.5;
        // Boost confidence for LSL-specific elements
        if (hasDefaultState)
            confidence += 0.2;
        if (hasStateEntry)
            confidence += 0.1;
        if (tokens.some(t => t.type === 'function' && this.LSL_FUNCTIONS.includes(t.value))) {
            confidence += 0.2;
        }
        // Reduce confidence for contamination
        if (hasPHPTags || hasHTMLTags || hasMediaWikiSyntax)
            confidence -= 0.5;
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            confidence: Math.max(0, Math.min(1, confidence))
        };
    }
    static extractCleanLSLCode($) {
        // Try multiple selectors to find LSL code
        const selectors = [
            'pre.lsl',
            'pre.source-lsl',
            'code.lsl',
            'pre:contains("default")',
            'pre:contains("state_entry")',
            'pre:contains("llSay")'
        ];
        for (const selector of selectors) {
            const element = $(selector).first();
            if (element.length > 0) {
                const code = element.text().trim();
                const validation = this.validateLSLCode(code);
                if (validation.confidence > 0.7) {
                    return code;
                }
            }
        }
        // Fallback: try to extract from generic pre tags
        const preElements = $('pre');
        for (let i = 0; i < preElements.length; i++) {
            const code = $(preElements[i]).text().trim();
            const validation = this.validateLSLCode(code);
            if (validation.confidence > 0.5) {
                return code;
            }
        }
        return '';
    }
    static extractLSLFunction($) {
        const func = {};
        // Extract function name from title or heading
        const title = $('h1, .firstHeading').first().text().trim();
        if (title) {
            func.name = title.replace(/^Function:\s*/, '').replace(/\s*\(.*\)$/, '');
        }
        // Extract description from first paragraph
        const description = $('.mw-parser-output > p').first().text().trim();
        if (description && !description.includes('{{') && !description.includes('[[')) {
            func.description = description;
        }
        // Extract syntax from pre elements
        const syntax = this.extractCleanLSLCode($);
        if (syntax) {
            func.syntax = syntax;
        }
        // Extract examples
        const examples = [];
        $('pre').each((i, el) => {
            const code = $(el).text().trim();
            const validation = this.validateLSLCode(code);
            if (validation.confidence > 0.6 && !examples.includes(code)) {
                examples.push(code);
            }
        });
        func.examples = examples;
        return func;
    }
    static calculateSimilarity(code1, code2) {
        const tokens1 = this.tokenize(code1).filter(t => t.type !== 'whitespace');
        const tokens2 = this.tokenize(code2).filter(t => t.type !== 'whitespace');
        if (tokens1.length === 0 && tokens2.length === 0)
            return 1.0;
        if (tokens1.length === 0 || tokens2.length === 0)
            return 0.0;
        const set1 = new Set(tokens1.map(t => t.value));
        const set2 = new Set(tokens2.map(t => t.value));
        const intersection = [...set1].filter(x => set2.has(x)).length;
        const union = set1.size + set2.size - intersection;
        return union > 0 ? intersection / union : 0.0;
    }
}
exports.LSLParser = LSLParser;
//# sourceMappingURL=lsl-parser.js.map