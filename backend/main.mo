import Time "mo:core/Time";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Iter "mo:core/Iter";

actor {
  // Errors
  type CountdownTimerNotFound = Text;
  type CountdownTimerId = Nat;

  type CountdownTimer = {
    id : Nat;
    name : Text;
    startTime : Time.Time;
    endTime : Time.Time;
    duration : Time.Time;
    isPaused : Bool;
    isCompleted : Bool;
  };

  let countdownTimers = Map.empty<CountdownTimerId, CountdownTimer>();
  var nextId = 0;

  func getNextId() : CountdownTimerId {
    let id = nextId;
    nextId += 1;
    id;
  };

  func getTimer(id : CountdownTimerId) : CountdownTimer {
    switch (countdownTimers.get(id)) {
      case (null) { Runtime.trap("Timer not found. ") };
      case (?timer) { timer };
    };
  };

  // Create a new countdown timer
  public shared ({ caller }) func createCountdownTimer(name : Text, durationSeconds : Nat) : async CountdownTimerId {
    let id = getNextId();
    let currentTime = Time.now();
    let durationNanos = durationSeconds * 1_000_000_000; // Convert seconds to nanoseconds

    let newTimer : CountdownTimer = {
      id;
      name;
      startTime = currentTime;
      endTime = currentTime + durationNanos;
      duration = durationNanos;
      isPaused = false;
      isCompleted = false;
    };

    countdownTimers.add(id, newTimer);
    id;
  };

  // Rename an existing countdown timer
  public shared ({ caller }) func renameCountdownTimer(newName : Text, id : CountdownTimerId) : async () {
    let timer = getTimer(id);
    let renamedTimer = { timer with name = newName };
    countdownTimers.add(timer.id, renamedTimer);
  };

  public query ({ caller }) func getCountdownTimer(id : CountdownTimerId) : async CountdownTimer {
    getTimer(id);
  };

  public query ({ caller }) func getAllCountdownTimers() : async [CountdownTimer] {
    let timers = countdownTimers.values().toArray();
    timers;
  };

  public query ({ caller }) func getActiveTimers() : async [CountdownTimer] {
    let timers = Map.empty<CountdownTimerId, CountdownTimer>();
    for ((id, timer) in countdownTimers.entries()) {
      if (not timer.isCompleted) {
        timers.add(id, timer);
      };
    };
    timers.values().toArray();
  };

  public query ({ caller }) func getCompletedTimers() : async [CountdownTimer] {
    let timers = Map.empty<CountdownTimerId, CountdownTimer>();
    for ((id, timer) in countdownTimers.entries()) {
      if (timer.isCompleted) {
        timers.add(id, timer);
      };
    };
    timers.values().toArray();
  };

  // Pause a timer
  public shared ({ caller }) func pauseTimer(id : CountdownTimerId) : async () {
    let timer = getTimer(id);
    let updatedTimer = {
      timer with
      isPaused = true;
    };
    countdownTimers.add(timer.id, updatedTimer);
  };

  // Resume a paused timer
  public shared ({ caller }) func resumeTimer(id : CountdownTimerId) : async () {
    let timer = getTimer(id);
    let updatedTimer = {
      timer with
      isPaused = false;
    };
    countdownTimers.add(timer.id, updatedTimer);
  };

  // Complete a timer
  public shared ({ caller }) func completeTimer(id : CountdownTimerId) : async () {
    let timer = getTimer(id);
    let updatedTimer = {
      timer with
      isCompleted = true;
    };
    countdownTimers.add(timer.id, updatedTimer);
  };

  // Delete a timer
  public shared ({ caller }) func deleteTimer(id : CountdownTimerId) : async () {
    switch (countdownTimers.get(id)) {
      case (null) { Runtime.trap("Timer not found. ") };
      case (?_) {
        countdownTimers.remove(id);
      };
    };
  };
};

