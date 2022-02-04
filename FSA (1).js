class FSA {
  constructor() {
    let curState = undefined;
    let states = [];
    class State {
      constructor(name) {
        let transitions = {};
        this.getName = () => name;
        this.setName = function (newName) {
          name = newName;
          return this;
        }
        this.addTransition = function(e, s) {
          if(lib220.getProperty(transitions, e).found){
            let stateArray = lib220.getProperty(transitions, e).value;
            stateArray.push(s);
          } else {
            lib220.setProperty(transitions, e, [s]);
          }
          return this;
        }
        this.deleteTransition = function() {
          transitions = {};
        }
        this.nextState = function(e) {
          if (lib220.getProperty(transitions, e).found) {
          //what if e is found but no transitions q
            let nextSt = lib220.getProperty(transitions, e).value;
            let nextStIndex = Math.floor(Math.random() * nextSt.length);
              return nextSt[nextStIndex];
          } else {
              return undefined;
          }
        }
        this.nextStates = function(e) {
          if (lib220.getProperty(transitions, e).found) {
            return lib220.getProperty(transitions, e).value;
          } else {
            return [];
          }
        }
      }
    }
    class Memento {
      constructor() {
        let store = undefined;
        this.storeState = function (s) {
          store = s;
        }
        this.getState = function() {
          return store;
        }
      }
    }
    this.nextState = function(e) {
      if (curState !== undefined) {
        curState = curState.nextState(e);
      }
      return this;
    }
    this.createState = (s, transitions) => {
      let StateWithNameS = states.find(e => e.getName() === s);
      if (StateWithNameS !== undefined) {
        StateWithNameS.deleteTransition();
      }
// When you re-create a state, the old transitions disappear and new ones may
//get added.
// One easy way to do this would be with a method of State that
// deletes all transitions of the old state (resetting your variable to {} or []
// depending on how you store them). Then you can add the new ones, as usual.
      let newSt = new State(s);
      states.push(newSt);
      if(curState === undefined) {
        curState = newSt;
      }
      transitions.forEach ((obj) => {
        this.addTransition(newSt.getName(), obj);
      });
      return this;
    }
    this.addTransition = function (s, t) {
      states.filter(function (arg) {
        if (arg.getName() === s) {
          arg.addTransition(Object.keys(t)[0], states.filter(function (arg2) {
            if (arg2.getName() === Object.values(t)[0]) {
              return true;
            } else {
              return false;
            }
          }));
        }
      })
      return this;
    }
    this.showState = function() {
      if(curState === undefined) {
        return undefined;
      } else {
        return curState.getName();
      }
    }
    this.renameState = function(name, newName) {
      let StateWithNamename = states.find(e => e.getName() === name);
      if (StateWithNamename !== undefined) {
// if one state name is changed, we need to update all the transitions in other
//states which might contain the renamed state
        StateWithNamename.setName(newName);
      }
      return this;
    }
    this.createMemento = function() {
      let newMemento = new Memento();
      newMemento.storeState(this.showState()); // stores the name of my current state
//in newMemento
      return newMemento;
    }
    this.restoreMemento = function(m) {
      if (m !== undefined) {
        let newCurState = states.find(e => e.getName() === m.getState());
        if (newCurState !== undefined) {
          curState = newCurState;
        }
      }
      return this;
    }
  }
}