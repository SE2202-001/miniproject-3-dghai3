class Job {
  constructor({ Title, Posted, Type, Level, Skill, Detail }) {
    this.title = Title || "Unknown";
    this.postedTime = Posted || "Unknown";
    this.type = Type || "Unknown";
    this.level = Level || "Unknown";
    this.skill = Skill || "Unknown";
    this.detail = Detail || "No details provided.";
  }
  getDetails() {
    return `
      Title: ${this.title}
      Posted: ${this.postedTime} 
      Type: ${this.type}
      Level: ${this.level}
      Skill: ${this.skill}
      Details: ${this.detail}
    `;
  }
}
let jobs = [];
let filteredJobs = [];
let sortStates = { title: 'asc', postedTime: 'asc' };

document.getElementById('file-upload').addEventListener('change', handleFileUpload);
document.getElementById('filter-level').addEventListener('change', applyFilters);
document.getElementById('filter-type').addEventListener('change', applyFilters);
document.getElementById('filter-skill').addEventListener('change', applyFilters);
document.getElementById('sort-title').addEventListener('click', () => cycleSort('title'));
document.getElementById('sort-time').addEventListener('click', () => cycleSort('postedTime'));

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      jobs = data.map(jobData => new Job(jobData));
      filteredJobs = [...jobs];
      populateFilters();
      renderJobList();
    } catch (error) {
      alert("Error parsing file: " + error.message);
    }
  };
  reader.readAsText(file);
}
function populateFilters() {
  const levels = [...new Set(jobs.map(job => job.level))];
  const types = [...new Set(jobs.map(job => job.type))];
  const skills = [...new Set(jobs.map(job => job.skill))];

  populateFilterOptions('filter-level', levels);
  populateFilterOptions('filter-type', types);
  populateFilterOptions('filter-skill', skills);
}
function populateFilterOptions(id, options) {
  const select = document.getElementById(id);
  select.innerHTML = `<option value="">Filter by ${id.split('-')[1]}</option>`;
  options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option;
    select.appendChild(opt);
  });
}
function applyFilters() {
  const level = document.getElementById('filter-level').value;
  const type = document.getElementById('filter-type').value;
  const skill = document.getElementById('filter-skill').value;

  filteredJobs = jobs.filter(job => {
    return (!level || job.level === level) &&
           (!type || job.type === type) &&
           (!skill || job.skill === skill);
  });

  renderJobList();
}
function cycleSort(criteria) {
  sortStates[criteria] = sortStates[criteria] === 'asc' ? 'desc' : 'asc';
  sortJobs(criteria, sortStates[criteria]);
}
function sortJobs(criteria, order = 'asc') {
  filteredJobs.sort((a, b) => {
    if (criteria === 'title') {
      return order === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (criteria === 'postedTime') {
      return order === 'asc'
        ? parseRelativeTime(a.postedTime) - parseRelativeTime(b.postedTime)
        : parseRelativeTime(b.postedTime) - parseRelativeTime(a.postedTime);
    }
  });
  renderJobList();
}
function parseRelativeTime(relativeTime) {
  const timeParts = relativeTime.split(" ");
  const value = parseInt(timeParts[0], 10);
  const unit = timeParts[1].toLowerCase();

  const now = new Date().getTime(); // Current time in milliseconds
  let elapsedTime = 0;

  switch (unit) {
    case "minutes":
      elapsedTime = value * 60 * 1000; // Convert minutes to milliseconds
      break;
    case "hours":
      elapsedTime = value * 60 * 60 * 1000; // Convert hours to milliseconds
      break;
    case "days":
      elapsedTime = value * 24 * 60 * 60 * 1000; // Convert days to milliseconds
      break;
    default:
      console.error("Unknown time unit:", unit);
  }

  return now - elapsedTime; // Return standardized timestamp
}
function renderJobList() {
  const jobList = document.getElementById('job-list');
  jobList.innerHTML = ""; // Clear the current list

  if (filteredJobs.length === 0) {
    const message = document.createElement('div');
    message.className = 'no-jobs-message';
    message.textContent = "No jobs available.";
    jobList.appendChild(message);
    return;
  }
  filteredJobs.forEach(job => {
    const div = document.createElement('div');
    div.className = 'job-item';
    div.textContent = `${job.title} - ${job.type} - ${job.level} (${job.postedTime})`;
    div.addEventListener('click', () => alert(job.getDetails()));
    jobList.appendChild(div);
  });
}