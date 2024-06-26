import "./popup_event.css";
import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { currentUserAtom, bearerTokenAtom } from "../../atom/atoms";
import { axiosPrivate } from "../../api/axios";

const PopUpEvent = ({
  selectedEvent,
  closePoPup,
  isAttendee,
  setUserAttendance,
  attendance,
}) => {
  const [choice, setChoice] = useState(null);
  const [token, setToken] = useAtom(bearerTokenAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [loading, setLoading] = useState(null);
  const [hasAvailableSpots, setHasAvailableSpots] = useState(true);

  // Ensure token and current user are set
  useEffect(() => {
    if (!token || !currentUser) {
      console.error("Token or current user is not set.");
    }
  }, [token, currentUser]);

  // Determine if instrument selection should be displayed
  const shouldDisplayInstruments = () => {
    if (selectedEvent.event_instruments.length === 0) {
      return false;
    }
    if (
      selectedEvent.event_instruments.length === 1 &&
      selectedEvent.event_instruments[0].instrument.name.toLowerCase() ===
      "aucun"
    ) {
      return false;
    }
    return true;
  };

  // Handle event registration
  const handleInscription = async (e) => {
    e.preventDefault();
    setLoading(true);
    const eventInstrumentId = shouldDisplayInstruments()
      ? choice
      : selectedEvent.event_instruments[0].id; //Select the only one event_instrument.  "Aucun"

    try {
      const response = await axiosPrivate.post(
        "/attendances",
        {
          attendance: {
            attendee_id: currentUser.id,
            event_id: selectedEvent.id,
            is_pending: !hasAvailableSpots,
            event_instrument_id: eventInstrumentId,
          },
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(response);
      await setUserAttendance(selectedEvent);
      setChoice(null); // Update attendance status after registration
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle event unsubscription
  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      await Promise.all(
        attendance.map((att) =>
          axiosPrivate.delete(`/attendances/${att.id}`, {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          })
        )
      );
      await setUserAttendance(selectedEvent);
      setChoice(null);
      setLoading(false); // Update attendance status after unsubscription
      
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (choice) {
      // vérifier si places disponibles
      // update hasAvailableSpots => true or false
      const chosenEventInstrument = selectedEvent.event_instruments.filter(
        (eachEventInstrument) => eachEventInstrument.id === parseInt(choice)
      )[0];
      if (chosenEventInstrument.available_spots > 0) {
        setHasAvailableSpots(true);
      } else {
        setHasAvailableSpots(false);
      }
    }
  }, [choice]);

  if (loading) {
    return <h1> IS LOADING</h1>;
  }

  return (
    <>
      <div className="modal is-active">
        <div className="flex modal-content">
          <div className="flex justify-center items-center">
            <img src={`http://127.0.0.1:3000${selectedEvent.event_picture_url}`} alt="" className=""/>
          </div>
          <div className="flex flex-col items-center w-4/6 gap-8 p-2 event_information">
            <div className="text-center title__event-container">
              <h2 className="">{selectedEvent.category}</h2>
              <p className="">{selectedEvent.title}</p>
            </div>
            <div className="text-center pricing">
              <h2>Prix</h2>
              <p>{selectedEvent.price} €</p>
            </div>
            <div className="text-center event_description">
              <h2>Description</h2>
              <p>{selectedEvent.description}</p>
            </div>
            <div className="text-center attendances">
              <h2>Liste des participants</h2>
              <div className="flex justify-center gap-5">
                {selectedEvent.event_instruments
                  .filter(
                    (instrument) =>
                      instrument.instrument.name.toLowerCase() !== "aucun"
                  )
                  .map((instrument, instrumentIndex) => (
                    <div key={instrumentIndex} className="flex flex-col">
                      <p>
                        {instrument.instrument.name}{" "}
                        {instrument.available_spots}/{instrument.total_spots}
                      </p>
                      {instrument.attendances
                        .filter((attendee) => !attendee.is_pending) // Filtrer les attendances
                        .map((attendee, attendeeIndex) => (
                          <p key={attendeeIndex}>{attendee.attendee.first_name}</p>
                        ))}
                    </div>
                  ))}
              </div>
              <p>Merci d'ajouter un dropdown menu avec les participants</p>
            </div>
            {!isAttendee ? (
              shouldDisplayInstruments() ? (
                <div>
                  <h2>Choisissez un instrument</h2>
                  <form className="text-center" onSubmit={handleInscription}>
                    <div className="flex items-center justify-center gap-5">
                      {selectedEvent.event_instruments
                        .filter(
                          (instrument) =>
                            instrument.instrument.name.toLowerCase() !== "aucun"
                        )
                        .map((instrument, index) => (
                          <div key={index} className="instrument-radio">
                            <input
                              type="radio"
                              id={`instrument-${index}`}
                              name="instrument"
                              value={instrument.id}
                              onClick={(e) => {setChoice(e.target.value); setHasAvailableSpots(true)}}
                            />
                            <label htmlFor={`instrument-${index}`}>
                              {instrument.instrument.name}
                            </label>
                          </div>
                        ))}
                      <button
                        type="reset"
                        className="p-1 text-white rounded-full bg-danger-main"
                        onClick={() => { setChoice(null); setHasAvailableSpots(true) }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    {hasAvailableSpots ? (
                      <Button
                        className="mt-5 text-white bg-success-main"
                        type="submit"
                        isDisabled={!choice}
                      >
                        Je participe
                      </Button>
                    ) : (
                      <Button
                        className="mt-5 text-white bg-success-main"
                        type="submit"
                      >
                        Liste d'attente
                      </Button>
                    )}

                  </form>
                </div>
              ) : (
                <Button
                  className="text-white bg-success-main"
                  onClick={handleInscription}
                >
                  Je participe
                </Button>
              )
            ) : (
              <Button
                className="text-white bg-warning-main"
                onClick={handleUnsubscribe}
              >
                Je me désinscris
              </Button>
            )}
          </div>
          <button className="modal-close" onClick={closePoPup}>
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="25"
              height="25"
              viewBox="0 0 50 50"
              fill="#F31248"
            >
              <path
                d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z"
                stroke="#F31248"
                strokeWidth={1.5}
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default PopUpEvent;
