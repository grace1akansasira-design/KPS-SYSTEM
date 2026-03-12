import { Teacher, Subject, Room, Pupil, TimeSlot } from "@/hooks/useSupabaseData";

const now = new Date().toISOString();

export const mockTeachers: Teacher[] = [
  // NURSERY SECTION
  { id: "t-n1", name: "Sarah Kiconco", email: "sarah.k@nursery.kps.ac.ug", phone: "0772 100001", status: "active", subjects: ["Literacy", "Numeracy", "Rhymes & Singing", "Outdoor Play"], class: "Baby Class", section: "A", created_at: now, updated_at: now },
  { id: "t-n2", name: "Joy Namata", email: "joy.n@nursery.kps.ac.ug", phone: "0772 100002", status: "active", subjects: ["Literacy", "Creative Arts", "Social Development"], class: "Middle Class", section: "A", created_at: now, updated_at: now },
  { id: "t-n3", name: "Grace Atwine", email: "grace.a@nursery.kps.ac.ug", phone: "0772 100003", status: "active", subjects: ["Numeracy", "Environmental", "Physical Education"], class: "Top Class", section: "A", created_at: now, updated_at: now },
  { id: "t-n4", name: "Alice Johnson", email: "alice.j@nursery.kps.ac.ug", phone: "0772 100004", status: "active", subjects: ["Music", "Movement"], class: "Baby Class", section: "B", created_at: now, updated_at: now },
  { id: "t-n5", name: "Rosemary Wilson", email: "rosemary.w@nursery.kps.ac.ug", phone: "0772 100005", status: "active", subjects: ["Bible Stories", "Life Skills"], class: "Middle Class", section: "B", created_at: now, updated_at: now },
  { id: "t-n6", name: "Elizabeth Clark", email: "elizabeth.c@nursery.kps.ac.ug", phone: "0772 100006", status: "active", subjects: ["Pre-Reading", "Pre-Writing"], class: "Top Class", section: "B", created_at: now, updated_at: now },

  // PRIMARY SECTION
  { id: "t-p1", name: "Dorcus Twinomugisha", email: "dorcus.t@primary.kps.ac.ug", phone: "0772 200001", status: "active", subjects: ["Mathematics", "English", "Literacy I"], class: "P1", section: "A", created_at: now, updated_at: now },
  { id: "t-p2", name: "Arthur Tumwine", email: "arthur.t@primary.kps.ac.ug", phone: "0772 200002", status: "active", subjects: ["Mathematics", "Literacy II", "Religious Education", "Physical Education"], class: "P2", section: "A", created_at: now, updated_at: now },
  { id: "t-p3", name: "Ruth Kyarikunda", email: "ruth.k@primary.kps.ac.ug", phone: "0772 200003", status: "active", subjects: ["English", "Science", "SST", "Art and Technology"], class: "P3", section: "A", created_at: now, updated_at: now },
  { id: "t-p4", name: "Moses Mugisha", email: "moses.m@primary.kps.ac.ug", phone: "0772 200004", status: "active", subjects: ["Mathematics", "Science", "Computer Studies"], class: "P4", section: "A", created_at: now, updated_at: now },
  { id: "t-p5", name: "Innocent Muhwezi", email: "innocent.m@primary.kps.ac.ug", phone: "0772 200005", status: "on-leave", subjects: ["SST", "English", "Performing Arts"], class: "P5", section: "A", created_at: now, updated_at: now },
  { id: "t-p6", name: "Phionah Akankwasa", email: "phionah.a@primary.kps.ac.ug", phone: "0772 200006", status: "active", subjects: ["English", "Literature", "Agriculture"], class: "P6", section: "B", created_at: now, updated_at: now },
  { id: "t-p7", name: "Ambrose Byamukama", email: "ambrose.b@primary.kps.ac.ug", phone: "0772 200007", status: "active", subjects: ["Mathematics", "Physics", "Integrated Science"], class: "P7", section: "A", created_at: now, updated_at: now },
];

export const mockSubjects: Subject[] = [
  // NURSERY SUBJECTS
  { id: "s-n3", code: "RHY-BABY", name: "Rhymes & Singing", class: "Baby Class", section: "A", teacher: "Sarah Kiconco", periods_per_week: 5, pupils: 25, term: "Term 1 2025", created_at: now, updated_at: now },
  { id: "s-n4", code: "OUT-BABY", name: "Outdoor Play", class: "Baby Class", section: "A", teacher: "Sarah Kiconco", periods_per_week: 5, pupils: 25, term: "Term 1 2025", created_at: now, updated_at: now },
  { id: "s-n4b", code: "MUS-BABY", name: "Music", class: "Baby Class", section: "B", teacher: "Alice Johnson", periods_per_week: 3, pupils: 22, term: "Term 1 2025", created_at: now, updated_at: now },
  { id: "s-n4c", code: "MOV-BABY", name: "Movement", class: "Baby Class", section: "B", teacher: "Alice Johnson", periods_per_week: 3, pupils: 22, term: "Term 1 2025", created_at: now, updated_at: now },

  { id: "s-n5", code: "LIT-MIDDLE", name: "Literacy", class: "Middle Class", section: "A", teacher: "Joy Namata", periods_per_week: 6, pupils: 30, term: "Term 1 2025", created_at: now, updated_at: now },
  { id: "s-n6", code: "ART-MIDDLE", name: "Creative Arts", class: "Middle Class", section: "A", teacher: "Joy Namata", periods_per_week: 4, pupils: 30, term: "Term 1 2025", created_at: now, updated_at: now },
  { id: "s-n7", code: "SOC-MIDDLE", name: "Social Development", class: "Middle Class", section: "A", teacher: "Joy Namata", periods_per_week: 4, pupils: 30, term: "Term 1 2025", created_at: now, updated_at: now },
  { id: "s-n7b", code: "BIB-MIDDLE", name: "Bible Stories", class: "Middle Class", section: "B", teacher: "Rosemary Wilson", periods_per_week: 2, pupils: 28, term: "Term 1 2025", created_at: now, updated_at: now },
  { id: "s-n7c", code: "LIF-MIDDLE", name: "Life Skills", class: "Middle Class", section: "B", teacher: "Rosemary Wilson", periods_per_week: 2, pupils: 28, term: "Term 1 2025", created_at: now, updated_at: now },

  { id: "s-n8", code: "NUM-TOP", name: "Numeracy", class: "Top Class", section: "A", teacher: "Grace Atwine", periods_per_week: 6, pupils: 35, term: "Term 1 2025", created_at: now, updated_at: now },
  { id: "s-n9", code: "ENV-TOP", name: "Environmental", class: "Top Class", section: "A", teacher: "Grace Atwine", periods_per_week: 5, pupils: 35, term: "Term 1 2025", created_at: now, updated_at: now },
  { id: "s-n10", code: "PE-TOP", name: "Physical Education", class: "Top Class", section: "A", teacher: "Grace Atwine", periods_per_week: 4, pupils: 35, term: "Term 1 2025", created_at: now, updated_at: now },
  { id: "s-n10b", code: "REA-TOP", name: "Pre-Reading", class: "Top Class", section: "B", teacher: "Elizabeth Clark", periods_per_week: 4, pupils: 32, term: "Term 1 2025", created_at: now, updated_at: now },
  { id: "s-n10c", code: "WRI-TOP", name: "Pre-Writing", class: "Top Class", section: "B", teacher: "Elizabeth Clark", periods_per_week: 4, pupils: 32, term: "Term 1 2025", created_at: now, updated_at: now },
  
  // PRIMARY SUBJECTS
  { id: "s-p1", code: "MAT-P1", name: "Mathematics", class: "P1", teacher: "Dorcus Twinomugisha", periods_per_week: 6, pupils: 40, term: "Term 1", section: "A", created_at: now, updated_at: now },
  { id: "s-p2", code: "LIT-P2", name: "Literacy II", class: "P2", teacher: "Arthur Tumwine", periods_per_week: 6, pupils: 42, term: "Term 1", section: "A", created_at: now, updated_at: now },
  { id: "s-p3", code: "ENG-P3", name: "English", class: "P3", teacher: "Ruth Kyarikunda", periods_per_week: 6, pupils: 45, term: "Term 1", section: "A", created_at: now, updated_at: now },
  { id: "s-p4", code: "SCI-P4", name: "Science", class: "P4", teacher: "Moses Mugisha", periods_per_week: 5, pupils: 48, term: "Term 1", section: "A", created_at: now, updated_at: now },
  { id: "s-p5", code: "SST-P5", name: "Social Studies", class: "P5", teacher: "Innocent Muhwezi", periods_per_week: 5, pupils: 50, term: "Term 1", section: "A", created_at: now, updated_at: now },
  { id: "s-p6", code: "ENG-P6", name: "English", class: "P6", teacher: "Phionah Akankwasa", periods_per_week: 4, pupils: 40, term: "Term 1", section: "B", created_at: now, updated_at: now },
  { id: "s-p7", code: "MAT-P7", name: "Mathematics", class: "P7", teacher: "Ambrose Byamukama", periods_per_week: 5, pupils: 45, term: "Term 1", section: "A", created_at: now, updated_at: now },
  { id: "s-p8", code: "RE-P1", name: "Religious Education", class: "P1", teacher: "Arthur Tumwine", periods_per_week: 2, pupils: 40, term: "Term 1", section: "A", created_at: now, updated_at: now },
  { id: "s-p9", code: "PE-P2", name: "Physical Education", class: "P2", teacher: "Arthur Tumwine", periods_per_week: 2, pupils: 42, term: "Term 1", section: "A", created_at: now, updated_at: now },
  { id: "s-p10", code: "ART-P3", name: "Art and Technology", class: "P3", teacher: "Ruth Kyarikunda", periods_per_week: 2, pupils: 45, term: "Term 1", section: "A", created_at: now, updated_at: now },
  { id: "s-p11", code: "COMP-P4", name: "Computer Studies", class: "P4", teacher: "Moses Mugisha", periods_per_week: 2, pupils: 48, term: "Term 1", section: "A", created_at: now, updated_at: now },
  { id: "s-p12", code: "PAM-P5", name: "Performing Arts", class: "P5", teacher: "Innocent Muhwezi", periods_per_week: 2, pupils: 50, term: "Term 1", section: "A", created_at: now, updated_at: now },
  { id: "s-p13", code: "AGR-P6", name: "Agriculture", class: "P6", teacher: "Phionah Akankwasa", periods_per_week: 2, pupils: 40, term: "Term 1", section: "B", created_at: now, updated_at: now },
  { id: "s-p14", code: "ISCI-P7", name: "Integrated Science", class: "P7", teacher: "Ambrose Byamukama", periods_per_week: 5, pupils: 45, term: "Term 1", section: "A", created_at: now, updated_at: now },
];

export const mockRooms: Room[] = [
  { id: "r-n1", name: "Baby Class Room", type: "Classroom", capacity: 35, building: "Nursery Block", facilities: ["Toys", "Mats"], status: "available", created_at: now, updated_at: now },
  { id: "r-p1", name: "P1 Room", type: "Classroom", capacity: 50, building: "Lower Primary", facilities: ["Desks", "Board"], status: "available", created_at: now, updated_at: now },
  { id: "r-p7", name: "P7 Room", type: "Classroom", capacity: 60, building: "Upper Primary", facilities: ["Desks", "Board"], status: "available", created_at: now, updated_at: now },
];

export const mockPupils: Pupil[] = [
  { id: "p-n1", pupil_id: "KPS-N001", name: "Mercy Kiconco", age: 3, class: "Baby Class", section: "A", email: "mercy.k@kps.ac.ug", status: "Active", subjects: ["Literacy", "Numeracy"], created_at: now, updated_at: now },
  { id: "p-p1", pupil_id: "KPS-P001", name: "Trevor Tumwine", age: 6, class: "P1", section: "A", email: "trevor.t@kps.ac.ug", status: "Active", subjects: ["Mathematics", "English"], created_at: now, updated_at: now },
  { id: "p-p7", pupil_id: "KPS-P007", name: "Praise Kyarikunda", age: 12, class: "P7", section: "A", email: "praise.k@kps.ac.ug", status: "Active", subjects: ["Mathematics", "Science"], created_at: now, updated_at: now },
];

export const mockTimeSlots: TimeSlot[] = [
  { id: "ts-n1", day: "Monday", start_time: "08:00", end_time: "09:00", subject: "Rhymes & Singing", teacher: "Sarah Kiconco", room: "Baby Class Room", type: "Activity", class: "Baby Class", section: "A", created_at: now, updated_at: now },
  { id: "ts-p1", day: "Monday", start_time: "08:00", end_time: "09:00", subject: "Mathematics", teacher: "Dorcus Twinomugisha", room: "P1 Room", type: "Class", class: "P1", section: "A", created_at: now, updated_at: now },
  { id: "ts-p7", day: "Monday", start_time: "08:00", end_time: "09:00", subject: "Mathematics", teacher: "Ambrose Byamukama", room: "P7 Room", type: "Class", class: "P7", section: "A", created_at: now, updated_at: now },
];

// Helper functions for local storage mock backend
export function getMockData<T>(key: string, initialData: T[]): T[] {
  try {
    const stored = localStorage.getItem(`mock_${key}`);
    // If we have an older mock version, overwrite it to force the new mock dataset
    if (stored) {
       const parsed = JSON.parse(stored);
       // Only return local storage if there are more than 3 objects (our old default) 
       // to ensure the new big dataset gets loaded instead!
       if (Array.isArray(parsed) && parsed.length > 3) {
           return parsed;
       }
    }
  } catch (e) {
    console.error("Local storage error", e);
  }
  localStorage.setItem(`mock_${key}`, JSON.stringify(initialData));
  return initialData;
}

export function setMockData<T>(key: string, data: T[]): void {
  localStorage.setItem(`mock_${key}`, JSON.stringify(data));
}
