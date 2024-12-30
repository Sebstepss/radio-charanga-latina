import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class PolicyAcceptanceService {
  constructor(private firestore: Firestore) {}

  async recordPolicyAcceptance() {
    const deviceId = await this.getDeviceId();
    const acceptanceData = {
      deviceId: deviceId,
      timestamp: new Date()
    };

    try {
      await addDoc(collection(this.firestore, 'policy_acceptances'), acceptanceData);
      localStorage.setItem('policyAccepted', 'true');
    } catch (error) {
      console.error('Error recording policy acceptance:', error);
    }
  }

  async getDeviceId(): Promise<string> {
    const info = await Device.getId();
    return info.identifier;
  }


  hasPolicyBeenAccepted(): boolean {
    return localStorage.getItem('policyAccepted') === 'true';
  }
}
