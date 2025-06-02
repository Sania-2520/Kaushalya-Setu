
// src/app/knowledge-base/data.ts
import type { LucideIcon } from 'lucide-react';
import { Code2, Brain, ShieldCheck, Cpu, Cloud, Palette } from 'lucide-react';

export interface CourseNodeData {
  id: string;
  title: string;
  status: 'locked' | 'available' | 'completed';
  level: number; // Indicates order in the path
  description: string; // Short description for the node
  badgeEarned?: string; // e.g., "HTML Master"
}

export interface SectorData {
  id: string;
  name: string;
  description: string;
  IconComponent: LucideIcon;
  theme: 'floating-islands' | 'circuit-board'; // Example themes
  courses: CourseNodeData[];
}

export const KNOWLEDGE_BASE_DATA: SectorData[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Build modern websites and applications, from frontend to backend.',
    IconComponent: Code2,
    theme: 'floating-islands',
    courses: [
      { id: 'wd1', title: 'HTML Basics', status: 'completed', level: 1, description: 'Learn the skeleton of the web.', badgeEarned: 'HTML Novice' },
      { id: 'wd2', title: 'CSS Essentials', status: 'completed', level: 2, description: 'Style your web pages beautifully.', badgeEarned: 'CSS Stylist' },
      { id: 'wd3', title: 'JavaScript Fundamentals', status: 'available', level: 3, description: 'Add interactivity to your sites.' },
      { id: 'wd4', title: 'DOM Manipulation', status: 'locked', level: 4, description: 'Control web page content dynamically.' },
      { id: 'wd5', title: 'Responsive Design', status: 'locked', level: 5, description: 'Make sites look great on all devices.' },
      { id: 'wd6', title: 'Intro to React/Vue', status: 'locked', level: 6, description: 'Explore modern frontend frameworks.' },
      { id: 'wd7', title: 'Node.js & Express Basics', status: 'locked', level: 7, description: 'Understand server-side JavaScript.' },
      { id: 'wd8', title: 'Full-Stack Project Setup', status: 'locked', level: 8, description: 'Build your first complete web app.' },
    ],
  },
  {
    id: 'data-science',
    name: 'Data Science',
    description: 'Unlock insights from data using statistics, machine learning, and more.',
    IconComponent: Brain,
    theme: 'circuit-board', // Different theme for variety
    courses: [
      { id: 'ds1', title: 'Python for Data Science', status: 'completed', level: 1, description: 'Master the essential language for DS.', badgeEarned: 'Pythonista' },
      { id: 'ds2', title: 'NumPy & Pandas', status: 'available', level: 2, description: 'Learn powerful data manipulation libraries.' },
      { id: 'ds3', title: 'Data Visualization (Matplotlib/Seaborn)', status: 'locked', level: 3, description: 'Create compelling charts and graphs.' },
      { id: 'ds4', title: 'Statistics Fundamentals', status: 'locked', level: 4, description: 'Understand core statistical concepts.' },
      { id: 'ds5', title: 'Intro to Machine Learning', status: 'locked', level: 5, description: 'Explore basic ML algorithms.' },
      { id: 'ds6', title: 'Scikit-learn Workshop', status: 'locked', level: 6, description: 'Implement ML models with Scikit-learn.' },
      { id: 'ds7', title: 'Intro to Deep Learning', status: 'locked', level: 7, description: 'Get started with neural networks.' },
      { id: 'ds8', title: 'Data Science Capstone Project', status: 'locked', level: 8, description: 'Apply your skills to a real-world problem.' },
    ],
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Protect systems, networks, and data from digital threats.',
    IconComponent: ShieldCheck,
    theme: 'floating-islands',
    courses: [
      { id: 'cs1', title: 'Cybersecurity Basics', status: 'available', level: 1, description: 'Understand fundamental security concepts.' },
      { id: 'cs2', title: 'Network Security', status: 'locked', level: 2, description: 'Learn to secure network infrastructure.' },
      { id: 'cs3', title: 'Ethical Hacking Intro', status: 'locked', level: 3, description: 'Explore penetration testing techniques.' },
      { id: 'cs4', title: 'Cryptography Essentials', status: 'locked', level: 4, description: 'Understand encryption and secure communication.' },
      { id: 'cs5', title: 'Web Application Security (OWASP Top 10)', status: 'locked', level: 5, description: 'Secure web apps from common vulnerabilities.' },
      { id: 'cs6', title: 'Incident Response & Forensics', status: 'locked', level: 6, description: 'Learn to handle security breaches.' },
    ],
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    description: 'Leverage cloud platforms like AWS, Azure, and GCP for scalable solutions.',
    IconComponent: Cloud,
    theme: 'circuit-board',
    courses: [
      { id: 'cc1', title: 'Cloud Concepts', status: 'available', level: 1, description: 'Introduction to cloud computing models.' },
      { id: 'cc2', title: 'AWS Fundamentals', status: 'locked', level: 2, description: 'Core services of Amazon Web Services.' },
      { id: 'cc3', title: 'Azure Basics', status: 'locked', level: 3, description: 'Introduction to Microsoft Azure.' },
      { id: 'cc4', title: 'GCP Essentials', status: 'locked', level: 4, description: 'Key services of Google Cloud Platform.' },
      { id: 'cc5', title: 'Containers & Orchestration (Docker/Kubernetes)', status: 'locked', level: 5, description: 'Manage applications with containers.' },
      { id: 'cc6', title: 'Serverless Computing', status: 'locked', level: 6, description: 'Build event-driven applications.' },
    ],
  },
   {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    description: 'Create intuitive and engaging user interfaces and experiences.',
    IconComponent: Palette,
    theme: 'floating-islands',
    courses: [
      { id: 'ux1', title: 'Intro to UI/UX', status: 'completed', level: 1, description: 'Fundamentals of user-centric design.', badgeEarned: 'Design Thinker' },
      { id: 'ux2', title: 'User Research', status: 'available', level: 2, description: 'Understand your users and their needs.' },
      { id: 'ux3', title: 'Wireframing & Prototyping', status: 'locked', level: 3, description: 'Visualize and test your designs.' },
      { id: 'ux4', title: 'Visual Design Principles', status: 'locked', level: 4, description: 'Typography, color, layout.' },
      { id: 'ux5', title: 'Interaction Design', status: 'locked', level: 5, description: 'Create engaging user flows.' },
      { id: 'ux6', title: 'Usability Testing', status: 'locked', level: 6, description: 'Evaluate and improve your designs.' },
    ],
  },
  {
    id: 'embedded-systems',
    name: 'Embedded Systems',
    description: 'Design and develop hardware and software for specialized devices.',
    IconComponent: Cpu,
    theme: 'circuit-board',
    courses: [
      { id: 'es1', title: 'Microcontroller Basics (Arduino/Raspberry Pi)', status: 'available', level: 1, description: 'Get started with popular microcontrollers.' },
      { id: 'es2', title: 'C/C++ for Embedded', status: 'locked', level: 2, description: 'Programming for resource-constrained systems.' },
      { id: 'es3', title: 'Sensor Integration', status: 'locked', level: 3, description: 'Interface with various sensors.' },
      { id: 'es4', title: 'Real-Time Operating Systems (RTOS)', status: 'locked', level: 4, description: 'Understand RTOS concepts.' },
      { id: 'es5', title: 'IoT Fundamentals', status: 'locked', level: 5, description: 'Connect embedded devices to the internet.' },
    ],
  },
];
