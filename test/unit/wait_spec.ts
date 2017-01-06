import {Condition, wait} from "../../lib/wait";


describe('wait', function () {

    function cond() {
        return new Condition<Promise<number>>("pass on 3rd attempt", (function() {
            if (!(this.i>=3)) {
                return Promise.reject(new Error("attempt failed with i = " + this.i++));
            }
            return Promise.resolve(this.i);
        }).bind({i:1}));
    }

    it('waits for satisfied condition', function () {
        return wait(cond(), 300);
    });

    it('fails for non-satisfied condition', function () {
        return wait(cond(), 200)
            .then(
                success => Promise.reject(success),
                error => Promise.resolve(error));
    });

    // todo: add more tests
});