
// a.*b

const states = {
    0: {
        read: 'initial',
        transitions: {
        }
    },
}

const regex = "abc*cd*e"
const input = "abcdde";

const tokens = []
let stateIdx = 0;
let lastChar = -1;
for (let i = 0; i < regex.length; i++) {
    const char = regex.charAt(i);
    const nextChar = regex.charAt(i+1);

    if (nextChar === '*') {
        tokens.push(char+nextChar);
        i++;
    } else {
        tokens.push(char);
    }
}
console.log(tokens);

for (let i = 0; i < tokens.length; i++) {
    states[i + 1] = {
        read: tokens[i],
        transitions: {}
    }
}
console.log(states);

for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    states[stateIdx].transitions[token.charAt(0)] = stateIdx + 1

    if (token.charAt(1) === '*') {
        states[stateIdx + 1].transitions[token.charAt(0)] = stateIdx + 1
    }
    stateIdx++
}
states[stateIdx].final = true;
console.log(states);

let state = states[0];
for (let i = 0; i < input.length; i++) {
    const char = input.charAt(i);
    const next = state.transitions[char] !== undefined ? state.transitions[char] : state.transitions['any'];
    console.log("processing", char)
    if (next === undefined) {
        console.log("no transitions for", char, "in", state);
        process.exit(1);
    }
    state = states[next];
    console.log("now at", state);
}

if (!state.final) {
    console.log("state not final", state);
    process.exit(1);
}