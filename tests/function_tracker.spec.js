const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const trackerFactory = require('../project_modules/function_tracker');

chai.should();
chai.use(sinonChai);

function makeMockFunction(...values) {
  let i = 0;
  return () => {
    i++;
    return values[i-1];
  }
}


describe("function can tell the difference between changing return values", () => {
  it("returns which elements have left the array", (done) => {
    elementLeaveMock = sinon.spy();
    mockElementLeft = makeMockFunction([1,2,3], [1,2]);
    let tracker = trackerFactory({
      watchFunction: mockElementLeft
    });

    tracker.on('element_left', elementLeaveMock);

    tracker.call();
    tracker.call();

    elementLeaveMock.should.have.been.calledWith([3]);
    done();
  });
});

