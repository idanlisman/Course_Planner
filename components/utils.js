const numberOfYears = 5;
const numberOfSemesters = 3;
const creditsPerCourse = 3;
const uuidGenerator = (data) => {
    return `${data.ID}-${data.Number}-${data.Semester}-${data.Year}`;
}

export {uuidGenerator, numberOfYears, numberOfSemesters, creditsPerCourse};