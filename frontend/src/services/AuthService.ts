import { Patient, Doctor, Hospital, Admin, HospitalRegistrationRequest, DoctorRegistrationRequest, Otp } from '../types';
import { MedicalRecord, Notification, Reminder, Review, Availability } from '../types/backend-types';
import {
  patientRepository,
  doctorRepository,
  hospitalRepository,
  adminRepository,
  hospitalRequestRepository,
  doctorRequestRepository,
  otpRepository
} from '../lib/data-store';

interface RegistrationRequest {
  role: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  weight?: string;
  specialization?: string;
  licenseNumber?: string;
}

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export class AuthService {

  // Simple password encoding (in real app, use proper hashing)
  private encodePassword(password: string): string {
    return btoa(password); // Base64 encoding for demo
  }

  private decodePassword(encodedPassword: string): string {
    return atob(encodedPassword);
  }

  private verifyPassword(rawPassword: string, encodedPassword: string): boolean {
    return this.decodePassword(encodedPassword) === rawPassword;
  }

  register(request: RegistrationRequest): any {
    const role = request.role.toUpperCase();

    switch (role) {
      case "USER":
        return this.registerPatient({
          id: this.generatePatientId(),
          pid: this.generatePatientId(),
          patientId: this.generatePatientId(),
          name: request.name,
          email: request.email,
          password: this.encodePassword(request.password),
          phone: request.phone || '',
          age: 0,
          gender: request.gender as 'Male' | 'Female' | 'Other' || 'Male',
          weight: parseFloat(request.weight || '0'),
          dateOfBirth: request.dateOfBirth || '',
          role: 'USER',
          createdAt: new Date().toISOString(),
        });
      case "DOCTOR":
        return this.registerDoctor({
          id: this.generateDoctorId(),
          name: request.name,
          email: request.email,
          password: this.encodePassword(request.password),
          phone: request.phone || '',
          specialization: request.specialization || '',
          licenseNumber: request.licenseNumber || '',
          role: 'DOCTOR',
          status: 'pending',
          experience: 0,
          rating: 0,
          available: true,
          consultationFee: 0,
          createdAt: new Date().toISOString(),
        });
      case "HOSPITAL":
        return this.registerHospital({
          id: this.generateHospitalId(),
          name: request.name,
          hospitalName: request.name,
          email: request.email,
          password: this.encodePassword(request.password),
          phone: request.phone || '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          role: 'HOSPITAL',
          status: 'pending',
          totalDoctors: 0,
          facilities: [],
          registrationNumber: '',
          createdAt: new Date().toISOString(),
        });
      default:
        throw new Error("Invalid role");
    }
  }

  registerPatient(patient: Patient): Patient {
    if (patientRepository.findByEmail(patient.email)) {
      throw new Error("Email already registered");
    }
    return patientRepository.save(patient);
  }

  registerHospital(request: HospitalRegistrationRequest): HospitalRegistrationRequest {
    if (hospitalRequestRepository.findByEmail(request.email)) {
      throw new Error("Email already registered");
    }
    return hospitalRequestRepository.save(request);
  }

  registerDoctor(request: DoctorRegistrationRequest): DoctorRegistrationRequest {
    if (doctorRequestRepository.findByEmail(request.email)) {
      throw new Error("Email already registered");
    }
    return doctorRequestRepository.save(request);
  }

  login(email: string, password: string): string {
    // Check in Admins
    const admin = adminRepository.findByEmail(email);
    if (admin && this.verifyPassword(password, admin.password)) {
      return this.generateToken(admin.email, admin.role);
    }

    // Check in Patients
    const patient = patientRepository.findByEmail(email);
    if (patient && patient.password && this.verifyPassword(password, patient.password)) {
      return this.generateToken(patient.email, patient.role || 'USER');
    }

    // Check in Hospitals
    const hospital = hospitalRepository.findByEmail(email);
    if (hospital && hospital.password && this.verifyPassword(password, hospital.password)) {
      return this.generateToken(hospital.email, hospital.role || 'HOSPITAL');
    }

    // Check in Doctors
    const doctor = doctorRepository.findByEmail(email);
    if (doctor && doctor.password && this.verifyPassword(password, doctor.password)) {
      return this.generateToken(doctor.email, doctor.role || 'DOCTOR');
    }

    throw new Error("Invalid credentials");
  }

  changePassword(email: string, oldPassword: string, newPassword: string): void {
    // Check in Admins
    let admin = adminRepository.findByEmail(email);
    if (admin && this.verifyPassword(oldPassword, admin.password)) {
      admin.password = this.encodePassword(newPassword);
      adminRepository.save(admin);
      return;
    }

    // Check in Patients
    let patient = patientRepository.findByEmail(email);
    if (patient && patient.password && this.verifyPassword(oldPassword, patient.password)) {
      patient.password = this.encodePassword(newPassword);
      patientRepository.save(patient);
      return;
    }

    // Check in Hospitals
    let hospital = hospitalRepository.findByEmail(email);
    if (hospital && hospital.password && this.verifyPassword(oldPassword, hospital.password)) {
      hospital.password = this.encodePassword(newPassword);
      hospitalRepository.save(hospital);
      return;
    }

    // Check in Doctors
    let doctor = doctorRepository.findByEmail(email);
    if (doctor && doctor.password && this.verifyPassword(oldPassword, doctor.password)) {
      doctor.password = this.encodePassword(newPassword);
      doctorRepository.save(doctor);
      return;
    }

    throw new Error("User not found or invalid password");
  }

  forgotPassword(email: string): void {
    // Check if user exists
    const userExists = adminRepository.findByEmail(email) ||
                      patientRepository.findByEmail(email) ||
                      hospitalRepository.findByEmail(email) ||
                      doctorRepository.findByEmail(email);

    if (!userExists) {
      throw new Error("User not found");
    }

    const otp = this.generateOtp();
    const otpEntity: Otp = {
      id: 0, // Will be set by repository
      email,
      otpCode: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      used: false,
    };

    otpRepository.save(otpEntity);

    // In real app, send email
    console.log(`OTP for ${email}: ${otp}`);
  }

  resetPassword(email: string, otp: string, newPassword: string): void {
    const otpEntity = otpRepository.findByEmailAndOtpCodeAndUsedFalse(email, otp);
    if (!otpEntity) {
      throw new Error("Invalid or expired OTP");
    }

    if (otpEntity.expiresAt < new Date()) {
      throw new Error("OTP has expired");
    }

    // Mark OTP as used
    otpRepository.markOtpAsUsed(email, otp);

    // Update password
    this.updateUserPassword(email, newPassword);
  }

  private updateUserPassword(email: string, newPassword: string): void {
    const encodedPassword = this.encodePassword(newPassword);

    // Check in Admins
    let admin = adminRepository.findByEmail(email);
    if (admin) {
      admin.password = encodedPassword;
      adminRepository.save(admin);
      return;
    }

    // Check in Patients
    let patient = patientRepository.findByEmail(email);
    if (patient) {
      patient.password = encodedPassword;
      patientRepository.save(patient);
      return;
    }

    // Check in Hospitals
    let hospital = hospitalRepository.findByEmail(email);
    if (hospital) {
      hospital.password = encodedPassword;
      hospitalRepository.save(hospital);
      return;
    }

    // Check in Doctors
    let doctor = doctorRepository.findByEmail(email);
    if (doctor) {
      doctor.password = encodedPassword;
      doctorRepository.save(doctor);
      return;
    }

    throw new Error("User not found");
  }

  getCurrentUser(email: string): any {
    // Check in Admins
    const admin = adminRepository.findByEmail(email);
    if (admin) {
      return {
        id: admin.id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      };
    }

    // Check in Patients
    const patient = patientRepository.findByEmail(email);
    if (patient) {
      return {
        id: patient.pid,
        name: patient.name,
        email: patient.email,
        role: patient.role,
      };
    }

    // Check in Hospitals
    const hospital = hospitalRepository.findByEmail(email);
    if (hospital) {
      return {
        id: hospital.hid,
        name: hospital.name,
        email: hospital.email,
        role: hospital.role,
      };
    }

    // Check in Doctors
    const doctor = doctorRepository.findByEmail(email);
    if (doctor) {
      return {
        id: doctor.did,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
      };
    }

    return null;
  }

  private generateToken(email: string, role: string): string {
    // Simple token generation for demo (in real app, use JWT)
    const payload = { email, role, exp: Date.now() + 24 * 60 * 60 * 1000 }; // 24 hours
    return btoa(JSON.stringify(payload));
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generatePatientId(): string {
    const maxId = patientRepository.findMaxId();
    return `P${(maxId + 1).toString().padStart(3, '0')}`;
  }

  private generateDoctorId(): string {
    const maxId = doctorRepository.findMaxId();
    return `D${(maxId + 1).toString().padStart(3, '0')}`;
  }

  private generateHospitalId(): string {
    const maxId = hospitalRepository.findMaxId();
    return `H${(maxId + 1).toString().padStart(3, '0')}`;
  }
}
