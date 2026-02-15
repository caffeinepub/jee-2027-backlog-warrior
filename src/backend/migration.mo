import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  // Define old and new types (identical, but needed for migration function)
  type ReminderId = Nat;
  type ReminderName = Text;

  type Reminder = {
    name : ReminderName;
    creationTime : Time.Time;
    scheduledTime : Time.Time;
    isCompleted : Bool;
    isCancelled : Bool;
  };

  type Actor = {
    nextReminderId : Nat;
    remindersMap : Map.Map<ReminderId, Reminder>;
  };

  // Migration function (trivial in this case)
  public func run(old : Actor) : Actor {
    { old with remindersMap = old.remindersMap };
  };
};
