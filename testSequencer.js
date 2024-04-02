// testSequencer.js
const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
    sort(tests) {
        const copyTests = Array.from(tests);
        return copyTests.sort((testA, testB) => {
            // Extract the number from the test title  (e.g. test-01-xxx.test.js)
            const matchA = testA.path.match(/test-(\d+)\.test.js$/);
            const matchB = testB.path.match(/test-(\d+)\.test.js$/);

            if (matchA && matchB) {
                const numA = parseInt(matchA[1], 10);
                const numB = parseInt(matchB[1], 10);

                return numA - numB;
            }

            return 0;
        });
    }
}

module.exports = CustomSequencer;