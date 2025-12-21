import React, { useEffect, useRef } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import WarningMsg from "../../utilities/Warning";

const DeleteEventModal = ({ event, isOpen, onClose, onConfirm }) => {
  const dialogRef = useRef(null);

  /* ---------------- OPEN / CLOSE ---------------- */
  useEffect(() => {
    if (isOpen && event) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen, event]);

  if (!event) return null;

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-error">Delete Event</h3>
          </div>
        </div>

        <div className="space-y-4">
          <p className="">
            Are you sure you want to delete{" "}
            <span className="font-bold">{event.title}</span>? This action is
            permanent and cannot be undone.
          </p>

          {event.attendeeCount > 0 && (
            <WarningMsg
              message={`${event.attendeeCount} user(s) registered for this event. They will be notified of the cancellation`}
            />
          )}
        </div>

        {/* ACTIONS */}
        <div className="modal-action">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="btn btn-error"
          >
            Delete Event
          </button>
          <button onClick={onClose} className="btn">
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteEventModal;
