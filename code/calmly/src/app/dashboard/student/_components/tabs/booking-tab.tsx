"use client";
import { useState, useEffect } from "react";
import { Calendar, Clock, User, MapPin, Phone, Star } from "lucide-react";

interface BookingTabProps {
  user: any;
}

export default function BookingTab({ user }: BookingTabProps) {
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const response = await fetch("/api/therapists");
      const data = await response.json();
      setTherapists(data);
    } catch (error) {
      console.error("Error fetching therapists:", error);
    }
  };

  const handleBooking = async () => {
    if (!selectedTherapist || !selectedDate || !selectedTime) {
      alert("Please select therapist, date, and time");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          therapistId: selectedTherapist.id,
          appointmentDate: new Date(`${selectedDate} ${selectedTime}`),
        }),
      });

      if (response.ok) {
        alert("Appointment booked successfully!");
        setSelectedTherapist(null);
        setSelectedDate("");
        setSelectedTime("");
      } else {
        alert("Error booking appointment. Please try again.");
      }
    } catch (error) {
      alert("Error booking appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  return (
    <div className="space-y-8">
      {/* Current Bookings */}
      {user.bookings && user.bookings.length > 0 && (
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
          <h3 className="mb-6 text-xl font-bold text-gray-900">Your Upcoming Appointments</h3>
          <div className="space-y-4">
            {user.bookings.map((booking: any) => (
              <div key={booking.id} className="rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                      <User className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Dr. {booking.therapist?.name || "TBD"}</h4>
                      <p className="text-gray-600">{booking.therapist?.specialization}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(booking.appointmentDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(booking.appointmentDate).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      booking.status === "CONFIRMED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book New Appointment */}
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        <h3 className="mb-6 text-xl font-bold text-gray-900">Book New Appointment</h3>

        {/* Therapist Selection */}
        <div className="mb-8">
          <h4 className="mb-4 font-semibold text-gray-900">Choose a Therapist</h4>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {therapists.map((therapist: any) => (
              <div
                key={therapist.id}
                onClick={() => setSelectedTherapist(therapist)}
                className={`cursor-pointer rounded-2xl border p-6 transition-all duration-200 ${
                  selectedTherapist?.id === therapist.id
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                    <User className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">{therapist.name}</h5>
                    <p className="text-sm text-gray-600">{therapist.specialization}</p>
                    <p className="mt-1 text-sm text-gray-500">{therapist.experience} years experience</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-600">{therapist.rating || 4.8}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-600">₹{therapist.sessionFee}/session</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date and Time Selection */}
        {selectedTherapist && (
          <div className="space-y-6">
            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Select Date</h4>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 md:w-auto"
              />
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-gray-900">Select Time</h4>
              <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-7">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`cursor-pointer rounded-xl border px-4 py-3 font-medium transition-all duration-200 ${
                      selectedTime === time
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={isLoading || !selectedDate || !selectedTime}
              className={`w-full cursor-pointer rounded-xl py-4 font-semibold transition-all duration-200 ${
                isLoading || !selectedDate || !selectedTime
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "bg-purple-600 text-white shadow-lg hover:bg-purple-700 hover:shadow-xl"
              }`}
            >
              {isLoading ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
