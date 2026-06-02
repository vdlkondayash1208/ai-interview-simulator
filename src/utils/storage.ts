import usersData from '../data/users.json';
import aptitudeData from '../data/aptitudeQuestions.json';
import codingData from '../data/codingQuestions.json';
import interviewData from '../data/interviewQuestions.json';

// Initialize mock DB in localStorage if it doesn't exist
export const initStorage = () => {
  if (!localStorage.getItem('db_users')) {
    localStorage.setItem('db_users', JSON.stringify(usersData));
  }
  if (!localStorage.getItem('db_aptitude')) {
    localStorage.setItem('db_aptitude', JSON.stringify(aptitudeData));
  }
  if (!localStorage.getItem('db_coding')) {
    localStorage.setItem('db_coding', JSON.stringify(codingData));
  }
  if (!localStorage.getItem('db_interview')) {
    localStorage.setItem('db_interview', JSON.stringify(interviewData));
  }
};

export const storage = {
  getUsers: () => JSON.parse(localStorage.getItem('db_users') || '[]'),
  
  saveUser: (user: any) => {
    const users = storage.getUsers();
    const index = users.findIndex((u: any) => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem('db_users', JSON.stringify(users));
  },
  
  getUserById: (id: string) => {
    const users = storage.getUsers();
    return users.find((u: any) => u.id === id);
  },

  updateUserStats: (userId: string, statsUpdates: any) => {
    const user = storage.getUserById(userId);
    if (user) {
      user.stats = { ...user.stats, ...statsUpdates };
      storage.saveUser(user);
    }
  },
  
  getAptitudeQuestions: () => JSON.parse(localStorage.getItem('db_aptitude') || '[]'),
  getCodingQuestions: () => JSON.parse(localStorage.getItem('db_coding') || '[]'),
  getInterviewQuestions: () => JSON.parse(localStorage.getItem('db_interview') || '[]')
};
