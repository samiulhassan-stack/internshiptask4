// Test script to demonstrate formatted backend output
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

async function testSubmission() {
  const formData = new FormData();
  
  formData.append('fullName', 'Ahmed Khan');
  formData.append('email', 'ahmed.khan@example.com');
  formData.append('phone', '+92 300 1234567');
  formData.append('eventType', 'conference');
  formData.append('eventDate', '2026-11-20');
  formData.append('message', 'I am very interested in attending this conference to learn about latest technologies and network with professionals.');
  
  // Create a dummy image file for testing
  const imageBuffer = Buffer.from('dummy image content');
  formData.append('profileImage', imageBuffer, {
    filename: 'test-profile.jpg',
    contentType: 'image/jpeg'
  });

  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log('Response:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSubmission();
