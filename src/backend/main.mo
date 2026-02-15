import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Migration "migration";

// Specify the data migration function in with-clause
(with migration = Migration.run)
actor {
  // Variables
  var nextReminderId = 0;
  let remindersMap = Map.empty<Nat, Reminder>();

  // Type aliases
  type ReminderId = Nat;
  type ReminderName = Text;

  // Reminder record
  type Reminder = {
    name : ReminderName;
    creationTime : Time.Time;
    scheduledTime : Time.Time;
    isCompleted : Bool;
    isCancelled : Bool;
  };

  // Helper function to generate unique reminder IDs.
  func getNextReminderId() : ReminderId {
    let id = nextReminderId;
    nextReminderId += 1;
    id;
  };

  // Create a new reminder with a specific name and scheduled time.
  public shared ({ caller }) func createReminder(name : ReminderName, scheduledTime : Time.Time) : async ReminderId {
    let reminderId = getNextReminderId();
    let reminder : Reminder = {
      name;
      creationTime = Time.now();
      scheduledTime;
      isCompleted = false;
      isCancelled = false;
    };
    remindersMap.add(reminderId, reminder);
    reminderId;
  };

  // Complete a reminder (mark as completed).
  public shared ({ caller }) func completeReminder(reminderId : ReminderId) : async Bool {
    switch (remindersMap.get(reminderId)) {
      case (null) { false };
      case (?reminder) {
        if (reminder.isCancelled) {
          return false;
        };
        let updatedReminder = {
          reminder with
          isCompleted = true;
        };
        remindersMap.add(reminderId, updatedReminder);
        true;
      };
    };
  };

  // Cancel a reminder.
  public shared ({ caller }) func cancelReminder(reminderId : ReminderId) : async Bool {
    switch (remindersMap.get(reminderId)) {
      case (null) { false };
      case (?reminder) {
        let updatedReminder = { reminder with isCancelled = true };
        remindersMap.add(reminderId, updatedReminder);
        true;
      };
    };
  };

  // Get a specific reminder by its ID.
  public query ({ caller }) func getReminder(reminderId : ReminderId) : async ?Reminder {
    remindersMap.get(reminderId);
  };

  // List all active (non-cancelled/non-completed) reminders.
  public query ({ caller }) func getActiveReminders() : async [Reminder] {
    remindersMap.values().filter(func(reminder) { not reminder.isCompleted and not reminder.isCancelled }).toArray();
  };

  // List all completed reminders.
  public query ({ caller }) func getCompletedReminders() : async [Reminder] {
    remindersMap.values().filter(func(reminder) { reminder.isCompleted }).toArray();
  };

  // Additional test helper to check total reminders
  public query ({ caller }) func getTotalReminders() : async Nat {
    remindersMap.size();
  };
};
