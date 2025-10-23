import { Appointment } from '../types';
import { Availability, Notification, Reminder } from '../types/backend-types';
import {
  appointmentRepository,
  availabilityRepository,
  notificationRepository,
  reminderRepository,
  patientRepository,
  doctorRepository
} from '../lib/data-store';

export class AppointmentService {

  bookAppointment(appointment: Appointment): Appointment {
    // Check if doctor is available at the time
    const availabilities = availabilityRepository.findByDoctorIdAndAvailableDate(
      typeof appointment.doctorId === 'string' ? parseInt(appointment.doctorId) : appointment.doctorId,
      appointment.date
    );

    const isAvailable = availabilities.some(a =>
      a.availableTimeSlot === appointment.time && a.isAvailable
    );

    if (!isAvailable) {
      throw new Error("Doctor not available at this time");
    }

    appointment.status = "BOOKED";

    // Save the appointment
    const savedAppointment = appointmentRepository.save(appointment);

    // Create reminder for the appointment
    this.createAppointmentReminder(savedAppointment);

    // Create notification for the appointment
    this.createAppointmentNotification(savedAppointment);

    // Send confirmation email (mock)
    this.sendAppointmentConfirmation(savedAppointment);

    return savedAppointment;
  }

  rescheduleAppointment(appointmentId: number, newDateTime: string): Appointment {
    const appointment = appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    // Check if doctor is available at new time
    const availabilities = availabilityRepository.findByDoctorIdAndAvailableDate(
      typeof appointment.doctorId === 'string' ? parseInt(appointment.doctorId) : appointment.doctorId,
      new Date(newDateTime).toISOString().split('T')[0]
    );

    const newTime = new Date(newDateTime).toTimeString().split(' ')[0].substring(0, 5);
    const isAvailable = availabilities.some(a =>
      a.availableTimeSlot === newTime && a.isAvailable
    );

    if (!isAvailable) {
      throw new Error("Doctor not available at this time");
    }

    appointment.dateTime = newDateTime;
    appointment.status = "BOOKED";

    const savedAppointment = appointmentRepository.save(appointment);

    // Create reschedule reminder
    this.createRescheduleReminder(savedAppointment);

    // Create reschedule notification
    this.createRescheduleNotification(savedAppointment);

    // Send reschedule confirmation
    this.sendRescheduleConfirmation(savedAppointment);

    return savedAppointment;
  }

  cancelAppointment(appointmentId: number): void {
    const appointment = appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    appointment.status = "cancelled";
    appointmentRepository.save(appointment);

    // Create cancellation notification
    this.createCancellationNotification(appointment);
  }

  getAppointmentsByPatient(patientId: string): Appointment[] {
    return appointmentRepository.findByPatientId(patientId);
  }

  getAppointmentsByDoctor(doctorId: number): Appointment[] {
    return appointmentRepository.findByDoctorId(doctorId);
  }

  getAppointmentsByHospital(hospitalId: number): Appointment[] {
    return appointmentRepository.findByHospitalId(hospitalId);
  }

  getAllAppointments(): Appointment[] {
    return appointmentRepository.findAll();
  }

  private createAppointmentReminder(appointment: Appointment): void {
    const reminder: Reminder = {
      id: 0, // Will be set by repository
      patientId: appointment.patientId,
      type: "appointment",
      message: `You have an appointment scheduled for ${appointment.dateTime || `${appointment.date} ${appointment.time}`}`,
      reminderDate: new Date(appointment.date).toISOString().split('T')[0], // One day before
      createdAt: new Date().toISOString(),
    };

    reminderRepository.save(reminder);
  }

  private createAppointmentNotification(appointment: Appointment): void {
    const message = `Your appointment has been booked for ${appointment.dateTime || `${appointment.date} ${appointment.time}`}`;
    const notification: Notification = {
      id: 0, // Will be set by repository
      patientId: appointment.patientId,
      type: "appointment",
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };

    notificationRepository.save(notification);
  }

  private sendAppointmentConfirmation(appointment: Appointment): void {
    const patient = patientRepository.findById(appointment.patientId);
    if (patient) {
      const subject = "Appointment Confirmation - Healthcare System";
      const message = `Dear ${patient.name},\n\nYour appointment has been successfully booked!\n\nAppointment Details:\nDate & Time: ${appointment.dateTime || `${appointment.date} ${appointment.time}`}\nDoctor: ${appointment.doctorName}\nHospital: ${appointment.hospitalId}\n\nPlease arrive 15 minutes early for your appointment.\n\nBest regards,\nHealthcare Appointment System`;

      // In real app, send email
      console.log("=== APPOINTMENT CONFIRMATION EMAIL ===");
      console.log(`To: ${patient.email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message:\n${message}`);
      console.log("=====================================");
    }
  }

  private createRescheduleReminder(appointment: Appointment): void {
    const reminder: Reminder = {
      id: 0, // Will be set by repository
      patientId: appointment.patientId,
      type: "appointment",
      message: `You have a rescheduled appointment for ${appointment.dateTime || `${appointment.date} ${appointment.time}`}`,
      reminderDate: new Date(appointment.date).toISOString().split('T')[0], // One day before
      createdAt: new Date().toISOString(),
    };

    reminderRepository.save(reminder);
  }

  private createRescheduleNotification(appointment: Appointment): void {
    const message = `Your appointment has been rescheduled to ${appointment.dateTime || `${appointment.date} ${appointment.time}`}`;
    const notification: Notification = {
      id: 0, // Will be set by repository
      patientId: appointment.patientId,
      type: "appointment",
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };

    notificationRepository.save(notification);
  }

  private sendRescheduleConfirmation(appointment: Appointment): void {
    const patient = patientRepository.findById(appointment.patientId);
    if (patient) {
      const subject = "Appointment Rescheduled - Healthcare System";
      const message = `Dear ${patient.name},\n\nYour appointment has been successfully rescheduled!\n\nUpdated Appointment Details:\nDate & Time: ${appointment.dateTime || `${appointment.date} ${appointment.time}`}\nDoctor: ${appointment.doctorName}\nHospital: ${appointment.hospitalId}\n\nPlease arrive 15 minutes early for your appointment.\n\nIf you need to cancel, please contact us.\n\nBest regards,\nHealthcare Appointment System`;

      // In real app, send email
      console.log("=== APPOINTMENT RESCHEDULE EMAIL ===");
      console.log(`To: ${patient.email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message:\n${message}`);
      console.log("===================================");
    }
  }

  private createCancellationNotification(appointment: Appointment): void {
    const message = `Your appointment scheduled for ${appointment.dateTime || `${appointment.date} ${appointment.time}`} has been cancelled.`;
    const notification: Notification = {
      id: 0, // Will be set by repository
      patientId: appointment.patientId,
      type: "appointment",
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };

    notificationRepository.save(notification);
  }
}
