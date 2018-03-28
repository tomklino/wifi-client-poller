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
    let elementLeaveMock = sinon.spy();
    let tracker = trackerFactory({
      watchFunction: makeMockFunction([1,2,3], [1,2])
    });

    tracker.on('element_left', elementLeaveMock);

    tracker.call();
    tracker.call();

    elementLeaveMock.should.have.been.calledWith([3]);
    done();
  });

  it("does not trigger the event when no elements leave", (done) => {
    let elementLeaveMock = sinon.spy();
    let tracker = trackerFactory({
      watchFunction: makeMockFunction([1,2,3], [1,3,2,4])
    });

    tracker.on('element_left', elementLeaveMock);

    tracker.call();
    tracker.call();

    elementLeaveMock.should.have.not.been.called;
    done();
  });
});

