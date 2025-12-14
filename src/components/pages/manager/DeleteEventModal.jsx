import React, { useEffect, useRef } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

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
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold">Delete Event</h3>
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <span className="font-bold text-error">{event.title}</span>? This
            action is permanent and cannot be undone.
          </p>

          {event.attendeeCount > 0 && (
            <div className="alert alert-warning">
              <FaExclamationTriangle />
              <div>
                <p className="font-semibold">
                  {event.attendeeCount} user(s) registered for this event
                </p>
                <p className="text-sm">
                  They will be notified of the cancellation
                </p>
              </div>
            </div>
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
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteEventModal;
