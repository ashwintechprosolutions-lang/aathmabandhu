# Aatma Bandhu: Demo Accounts & Presentation Guide

All data is fictional demo data that runs inside the browser. No real person, email or Aadhaar number is used. The Aadhaar numbers start with 0 or 1, which UIDAI never issues.
Region used for the demo data: **Telangana** (Hyderabad, Warangal, Karimnagar, Nizamabad, Khammam, Mahbubnagar, Siddipet, Nalgonda).

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

## Three dashboards, one login screen

Every account signs in at the same **Login** screen; the app automatically opens the right dashboard for that
account type and blocks it from the other two:

| Role | Opens | What it can do |
|------|-------|-----------------|
| **Citizen** (`user_type_id 2`) | Home dashboard | Raise a complaint, track "My Complaints", read notifications, edit profile |
| **Officer** (`user_type_id 3`) | Assigned-complaints queue | See complaints assigned in their department, mark them "in progress" / "resolved", notifications, profile |
| **Admin** (`user_type_id 1`) | Overview dashboard | Department stats + charts, every complaint, add/remove officers, view citizens, notifications |

## Citizen logins (these open the app)

| Name | Email | Password |
|------|-------|----------|
| **Ravi Kumar** (main demo user, 8 complaints) | `user@atmabandhu.in` | `User@123` |
| Priya Sharma | `priya@atmabandhu.in` | `Priya@123` |
| Lakshmi Devi | `lakshmi.devi@atmabandhu.in` | `Demo@123` |
| Venkatesh Goud | `venkatesh.goud@atmabandhu.in` | `Demo@123` |
| Sai Charan Reddy | `saicharan.reddy@atmabandhu.in` | `Demo@123` |
| Fatima Begum | `fatima.begum@atmabandhu.in` | `Demo@123` |
| Srinivas Rao | `srinivas.rao@atmabandhu.in` | `Demo@123` |
| Anjali Verma | `anjali.verma@atmabandhu.in` | `Demo@123` |
| Mohammed Irfan | `mohammed.irfan@atmabandhu.in` | `Demo@123` |
| Kavitha Naidu | `kavitha.naidu@atmabandhu.in` | `Demo@123` |
| Ramesh Yadav | `ramesh.yadav@atmabandhu.in` | `Demo@123` |
| Sunitha Reddy | `sunitha.reddy@atmabandhu.in` | `Demo@123` |
| Prakash Chary | `prakash.chary@atmabandhu.in` | `Demo@123` |
| Divya Teja | `divya.teja@atmabandhu.in` | `Demo@123` |
| Joseph Raju | `joseph.raju@atmabandhu.in` | `Demo@123` |
| Padmavathi K | `padmavathi.k@atmabandhu.in` | `Demo@123` |
| Nagaraju Bandi | `nagaraju.bandi@atmabandhu.in` | `Demo@123` |
| Swathi Rani | `swathi.rani@atmabandhu.in` | `Demo@123` |
| Harish Patel | `harish.patel@atmabandhu.in` | `Demo@123` |
| Rekha Kumari | `rekha.kumari@atmabandhu.in` | `Demo@123` |
| Anil Kumar Jadhav | `anil.jadhav@atmabandhu.in` | `Demo@123` |
| Shabana Khatoon | `shabana.khatoon@atmabandhu.in` | `Demo@123` |
| Mallesh Mudiraj | `mallesh.mudiraj@atmabandhu.in` | `Demo@123` |
| Bhavani Shankar | `bhavani.shankar@atmabandhu.in` | `Demo@123` |
| Geetha Lakshmi | `geetha.lakshmi@atmabandhu.in` | `Demo@123` |

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

(`@…` = `@atmabandhu.in`)

Admin: `admin@atmabandhu.in` / `Admin@123`. Logging in opens the administrator overview dashboard.

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
2. **Sign up a new citizen live**: Sign Up → Aadhaar `1000 2000 3001` → **Verify** (Sneha Reddy's details fill in) → email `sneha.reddy@atmabandhu.in`, password `Demo@123` → **SignUp**.
3. **Log in as a citizen**: `user@atmabandhu.in` / `User@123`. Show the dashboard, then **Raise a New Complaint** (pick a department, e.g. Roads, fill the form, submit) and show it land in **My Complaints**.
4. **Log out, log in as the officer for that department** (e.g. `meena.agent@atmabandhu.in` / `Agent@123` for Roads). Show the new complaint in their queue and click **Start Work**, then **Mark Resolved**.
5. **Log out, log in as admin**: `admin@atmabandhu.in` / `Admin@123`. Show the overview dashboard (stat tiles, the department bar chart, the officer workload chart), then **Officers** (add one live) and **Citizens**.
6. **Forgot password**: Login → Forgot Password → `user@atmabandhu.in` → Send Otp. The OTP appears in the alert (in production it is emailed) → set a new password → log in again.
7. **Show error handling**: a wrong password shows a clear message, and signing up with an email that's already registered is blocked.
8. **Show it on phones**: open the same URL on a phone, including fold/flip cover screens.

**Reset before presenting:** open the browser console (F12) and run `atmaResetDemoData()`, then refresh. This clears any accounts or changes made during rehearsal.
