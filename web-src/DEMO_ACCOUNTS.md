# Aathma Bandhu: Demo Accounts & Presentation Guide

All data is fictional demo data that runs inside the browser. No real person, email or Aadhaar number is used. The Aadhaar numbers start with 0 or 1, which UIDAI never issues.
Region used for the demo data: **GHMC limits only** (Greater Hyderabad Municipal Corporation) - Ameerpet, Kukatpally, Secunderabad, Gachibowli, Dilsukhnagar, LB Nagar, Miyapur, Mehdipatnam, Banjara Hills, Jubilee Hills, Malakpet, Charminar, Uppal, Malkajgiri, Attapur, Musheerabad.

## What's in the demo data

| Item | Count |
|------|-------|
| Registered citizens | 25 |
| Department officers (agents) | 20 (2 per department) |
| Departments | 10 |
| Open complaints | 72 (in-progress + pending) |
| Resolved complaints (history in notifications) | 38 |
| Notifications | ~320 |
| Unregistered people in the Aadhaar registry (for the live sign-up demo) | 21 |

Departments: Electricity · Water Supply · Roads · Sanitation · Health · Education · Revenue & Land Records · Civil Supplies (Ration) · Pensions · Transport

## Four dashboards, one login screen

Every account signs in at the same **Login** screen; the app automatically opens the right dashboard for that
account type and blocks it from the others. The workflow: a **Citizen** raises a complaint, it's routed to an
**Officer** (the backend calls this role "Agent") who resolves it, a **Supervisor** can monitor progress for
their department (or all departments) and move a complaint to a different officer if needed, but can never
resolve one, and **Admin** (the government) sees and manages everything.

| Role | Opens | What it can do |
|------|-------|-----------------|
| **Citizen** (`user_type_id 2`) | Home dashboard | Raise a complaint, track "My Complaints" (list or map view), read notifications, edit profile |
| **Officer / Agent** (`user_type_id 3`) | Assigned-complaints queue | See complaints assigned in their department, mark them "in progress" / "resolved", notifications, profile |
| **Supervisor** (`user_type_id 4`) | Monitoring overview | Dashboard stats/charts, complaints, agents - scoped to one department or all. Can reassign a complaint to a different officer; cannot resolve a complaint or create/edit accounts |
| **Admin** (`user_type_id 1`) | Overview dashboard | Department stats + charts, the GIS complaint map, every complaint, add/remove officers and supervisors, view citizens, notifications |

## Citizen logins (these open the app)

| Name | Email | Password |
|------|-------|----------|
| **Ravi Kumar** (main demo user, 8 complaints) | `user@aathmabandhu.in` | `User@123` |
| Priya Sharma | `priya@aathmabandhu.in` | `Priya@123` |
| Lakshmi Devi | `lakshmi.devi@aathmabandhu.in` | `Demo@123` |
| Venkatesh Goud | `venkatesh.goud@aathmabandhu.in` | `Demo@123` |
| Sai Charan Reddy | `saicharan.reddy@aathmabandhu.in` | `Demo@123` |
| Fatima Begum | `fatima.begum@aathmabandhu.in` | `Demo@123` |
| Srinivas Rao | `srinivas.rao@aathmabandhu.in` | `Demo@123` |
| Anjali Verma | `anjali.verma@aathmabandhu.in` | `Demo@123` |
| Mohammed Irfan | `mohammed.irfan@aathmabandhu.in` | `Demo@123` |
| Kavitha Naidu | `kavitha.naidu@aathmabandhu.in` | `Demo@123` |
| Ramesh Yadav | `ramesh.yadav@aathmabandhu.in` | `Demo@123` |
| Sunitha Reddy | `sunitha.reddy@aathmabandhu.in` | `Demo@123` |
| Prakash Chary | `prakash.chary@aathmabandhu.in` | `Demo@123` |
| Divya Teja | `divya.teja@aathmabandhu.in` | `Demo@123` |
| Joseph Raju | `joseph.raju@aathmabandhu.in` | `Demo@123` |
| Padmavathi K | `padmavathi.k@aathmabandhu.in` | `Demo@123` |
| Nagaraju Bandi | `nagaraju.bandi@aathmabandhu.in` | `Demo@123` |
| Swathi Rani | `swathi.rani@aathmabandhu.in` | `Demo@123` |
| Harish Patel | `harish.patel@aathmabandhu.in` | `Demo@123` |
| Rekha Kumari | `rekha.kumari@aathmabandhu.in` | `Demo@123` |
| Anil Kumar Jadhav | `anil.jadhav@aathmabandhu.in` | `Demo@123` |
| Shabana Khatoon | `shabana.khatoon@aathmabandhu.in` | `Demo@123` |
| Mallesh Mudiraj | `mallesh.mudiraj@aathmabandhu.in` | `Demo@123` |
| Bhavani Shankar | `bhavani.shankar@aathmabandhu.in` | `Demo@123` |
| Geetha Lakshmi | `geetha.lakshmi@aathmabandhu.in` | `Demo@123` |

## Officers (agents), password `Agent@123` for all

Logging in with any of these opens the officer dashboard for that department.

| Department | Officers |
|------------|----------|
| Electricity | Suresh Reddy `suresh.agent@…`, Anita Rao `anita.agent@…` |
| Water Supply | Kiran Naidu `kiran.agent@…`, Madhavi Latha `madhavi.agent@…` |
| Roads | Meena Iyer `meena.agent@…`, Rajashekar Goud `rajashekar.agent@…` |
| Sanitation | Arjun Das `arjun.agent@…`, Salma Sultana `salma.agent@…` |
| Health | Dr. Pavan Kumar `pavan.agent@…`, Dr. Sravani M `sravani.agent@…` |
| Education | Narsimha Chary `narsimha.agent@…`, Vijaya Lakshmi `vijaya.agent@…` |
| Revenue & Land Records | Ravinder Rao `ravinder.agent@…`, Shailaja P `shailaja.agent@…` |
| Civil Supplies (Ration) | Yadagiri B `yadagiri.agent@…`, Nirmala Devi `nirmala.agent@…` |
| Pensions | Satyanarayana M `satyanarayana.agent@…`, Hymavathi S `hymavathi.agent@…` |
| Transport | Venu Gopal `venu.agent@…`, Aruna Kumari `aruna.agent@…` |

(`@…` = `@aathmabandhu.in`)

## Supervisors, password `Supervisor@123` for all

They can see complaints and agents, and reassign a complaint to a different officer in their department. They can never resolve a complaint, and never create or edit accounts.

| Name | Email | Monitors |
|------|-------|----------|
| Ramesh Varma | `ramesh.super@aathmabandhu.in` | Water Supply only |
| Lakshmi Prasanna | `lakshmi.super@aathmabandhu.in` | Roads only |
| Chief Supervisor | `chief.super@aathmabandhu.in` | All departments |

Admin: `admin@aathmabandhu.in` / `Admin@123`. Logging in opens the administrator overview dashboard.

## Aadhaar numbers for the live sign-up demo

On **Sign Up**, type one of these numbers and press **Verify**. The name and mobile number fill in automatically. Then enter any new email and a password.

| Aadhaar | Name | Mobile |
|---------|------|--------|
| `1234 1234 1234` | Ramya Sri | 9848012345 |
| `1000 2000 3000` | Mahesh Goud | 9848023456 |
| `1000 2000 3001` | Sneha Reddy | 9848034567 |
| `1000 2000 3002` | Abdul Rahman | 9848045678 |
| `1000 2000 3003` | Keerthi Priya | 9848056789 |
| `1000 2000 3004` | Chandra Mohan | 9848067890 |
| `1000 2000 3005` | Pooja Kulkarni | 9848078901 |
| `1000 2000 3006` | Balaraju Kurma | 9848089012 |
| `1000 2000 3007` | Nandini Rao | 9848090123 |
| `1000 2000 3008` | Gopal Krishna | 9848001234 |

Spaces are optional. The original app's test numbers (`123456789` → Person1, etc.) still work.

## Suggested 10-minute demo flow

1. **Open the app**: splash screen → "Service in your hands" → **Get Started**.
2. **Sign up a new citizen live**: Sign Up → Aadhaar `1000 2000 3001` → **Verify** (Sneha Reddy's details fill in) → email `sneha.reddy@aathmabandhu.in`, password `Demo@123` → **SignUp**.
3. **Log in as a citizen**: `user@aathmabandhu.in` / `User@123`. Show the dashboard, then **Raise a New Complaint** (pick a department, e.g. Roads, fill the form, submit) and show it land in **My Complaints**.
4. **Log out, log in as the officer for that department** (e.g. `meena.agent@aathmabandhu.in` / `Agent@123` for Roads). Show the new complaint in their queue and click **Start Work**, then **Mark Resolved**.
5. **Log out, log in as admin**: `admin@aathmabandhu.in` / `Admin@123`. Show the overview dashboard (stat tiles, the department bar chart, the officer workload chart), then **Officers** (add one live) and **Citizens**.
6. **Forgot password**: Login → Forgot Password → `user@aathmabandhu.in` → Send Otp. The OTP appears in the alert (in production it is emailed) → set a new password → log in again.
7. **Show error handling**: a wrong password shows a clear message, and signing up with an email that's already registered is blocked.
8. **Show it on phones**: open the same URL on a phone, including fold/flip cover screens.

**Reset before presenting:** open the browser console (F12) and run `atmaResetDemoData()`, then refresh. This clears any accounts or changes made during rehearsal.
