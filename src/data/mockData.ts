export const APTITUDE_QUESTIONS = [
  {
    id: '1',
    category: 'quantitative aptitude',
    topic: 'Time and Work',
    question: 'A can do a piece of work in 10 days and B in 15 days. If they work together, in how many days will the work be finished?',
    options: ['4 days', '5 days', '6 days', '7 days'],
    correctAnswer: '6 days',
    explanation: 'A\'s 1 day work = 1/10. B\'s 1 day work = 1/15. Together = 1/10 + 1/15 = (3+2)/30 = 5/30 = 1/6. So 6 days.',
    company: 'TCS',
    year: '2022',
    difficulty: 'Easy'
  },
  {
    id: '2',
    category: 'logical reasoning',
    topic: 'Blood Relations',
    question: 'Pointing to a photograph, a man said, "I have no brother or sister but that man\'s father is my father\'s son." Whose photograph was it?',
    options: ['His own', 'His son\'s', 'His father\'s', 'His nephew\'s'],
    correctAnswer: 'His son\'s',
    explanation: 'Since he has no brother or sister, "my father\'s son" is himself. So, the man in the photograph\'s father is "himself". Thus, the man is the father of the person in the photograph.',
    company: 'Amazon',
    year: '2023',
    difficulty: 'Medium'
  }
];

export const CODING_QUESTIONS = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    company: 'Google',
    year: '2023',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    sampleInput: 'nums = [2,7,11,15], target = 9',
    sampleOutput: '[0,1]',
    initialCode: {
      javascript: 'function twoSum(nums, target) {\n  // Your code here\n}',
      python: 'def two_sum(nums, target):\n    # Your code here\n    pass',
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};'
    }
  }
];

export const INTERVIEW_QUESTIONS = [
  {
    id: '1',
    type: 'HR',
    question: 'Tell me about yourself.',
    tips: 'Focus on your professional journey, key achievements, and why you are a fit for this role.'
  },
  {
    id: '2',
    type: 'Technical',
    question: 'Explain the concept of closures in JavaScript.',
    tips: 'Mention lexical scope, inner functions having access to outer function scope even after outer function returns.'
  }
];
