document.addEventListener("DOMContentLoaded", () => {
    // Separate Opal and Maman assignments
    const OpalAssignments = [
        { name: "Opal Assignment 01", weight: 1 },
        { name: "Opal Assignment 02", weight: 1 },
        { name: "Opal Assignment 03", weight: 1 },
        { name: "Opal Assignment 04", weight: 1 },
        { name: "Opal Assignment 05", weight: 1 },
    ]

    const mamanAssignments = [
        { name: "Maman 11", weight: 3 },
        { name: "Maman 12", weight: 3 },
        { name: "Maman 13", weight: 3 },
        { name: "Maman 14", weight: 3 },
        { name: "Maman 15", weight: 3 },
    ]

    // Dynamically generate the table rows
    const tableBody = document.getElementById("assignmentTable")
    const maxRows = Math.max(OpalAssignments.length, mamanAssignments.length)

    for (let i = 0; i < maxRows; i++) {
        const row = document.createElement("tr")

        // Opal Assignments
        if (i < OpalAssignments.length) {
            const OpalNameCell = document.createElement("td")
            OpalNameCell.textContent = OpalAssignments[i].name
            row.appendChild(OpalNameCell)

            const OpalWeightCell = document.createElement("td")
            OpalWeightCell.textContent = OpalAssignments[i].weight
            row.appendChild(OpalWeightCell)

            const OpalGradeCell = document.createElement("td")
            const OpalInput = document.createElement("input")
            OpalInput.type = "number"
            OpalInput.id = `gradeOpal${i}`
            OpalInput.min = "0"
            OpalInput.max = "100"
            OpalInput.placeholder = "0-100"
            OpalGradeCell.appendChild(OpalInput)
            row.appendChild(OpalGradeCell)
        } else {
            row.appendChild(document.createElement("td"))
            row.appendChild(document.createElement("td"))
            row.appendChild(document.createElement("td"))
        }

        // Maman Assignments
        if (i < mamanAssignments.length) {
            const mamanNameCell = document.createElement("td")
            mamanNameCell.textContent = mamanAssignments[i].name
            row.appendChild(mamanNameCell)

            const mamanWeightCell = document.createElement("td")
            mamanWeightCell.textContent = mamanAssignments[i].weight
            row.appendChild(mamanWeightCell)

            const mamanGradeCell = document.createElement("td")
            const mamanInput = document.createElement("input")
            mamanInput.type = "number"
            mamanInput.id = `gradeMaman${i}`
            mamanInput.min = "0"
            mamanInput.max = "100"
            mamanInput.placeholder = "0-100"
            mamanGradeCell.appendChild(mamanInput)
            row.appendChild(mamanGradeCell)
        } else {
            row.appendChild(document.createElement("td"))
            row.appendChild(document.createElement("td"))
            row.appendChild(document.createElement("td"))
        }

        tableBody.appendChild(row)
    }

    // Add event listener for grade calculation
    document.getElementById("calculateButton").addEventListener("click", () => {
        const examGradeInput = document.getElementById("examGrade").value
        const examGrade = parseFloat(examGradeInput)

        document.getElementById("error").innerText = ""
        document.getElementById("result").innerText = ""
        const calculationContainer = document.getElementById("calculation")
        calculationContainer.innerHTML = ""
        calculationContainer.style.display = "none" // Hide the calculation container by default

        // Validate exam grade
        if (isNaN(examGrade) || examGradeInput === "") {
            document.getElementById("error").innerText =
                "Please enter a valid exam grade between 0 and 100."
            return
        }
        if (examGrade < 0 || examGrade > 100) {
            document.getElementById("error").innerText =
                "Exam grade must be between 0 and 100."
            return
        }

        // Collect grades for Opal and Maman assignments
        const grades = []
        OpalAssignments.forEach((assignment, index) => {
            const gradeInput = document.getElementById(`gradeOpal${index}`).value
            const grade = parseFloat(gradeInput)
            if (!isNaN(grade)) grades.push({ ...assignment, grade })
        })

        mamanAssignments.forEach((assignment, index) => {
            const gradeInput = document.getElementById(`gradeMaman${index}`).value
            const grade = parseFloat(gradeInput)
            if (!isNaN(grade)) grades.push({ ...assignment, grade })
        })

        // Check if the student has submitted assignments with at least 10 points in weight
        let totalAssignmentWeight = grades.reduce(
            (sum, assignment) => sum + assignment.weight,
            0,
        )
        if (totalAssignmentWeight < 10) {
            document.getElementById("error").innerText =
                "You must submit assignments with a total weight of at least 10 points."
            return
        }

        // Select assignments for the first 10 points in weight based on highest grades
        grades.sort((a, b) => b.grade - a.grade)

        let assignmentsConsidered = []
        let accumulatedWeight = 0

        for (let i = 0; i < grades.length; i++) {
            if (accumulatedWeight < 10) {
                assignmentsConsidered.push(grades[i])
                accumulatedWeight += grades[i].weight
            } else {
                break
            }
        }

        // Include additional assignments if their grades are higher than the exam grade
        for (let i = assignmentsConsidered.length; i < grades.length; i++) {
            if (grades[i].grade > examGrade) {
                assignmentsConsidered.push(grades[i])
                accumulatedWeight += grades[i].weight
            }
        }

        // Calculate final grade
        const totalConsideredWeight = assignmentsConsidered.reduce(
            (sum, a) => sum + a.weight,
            0,
        )
        const examWeightPercentage = 100 - totalConsideredWeight

        let calculationSteps = `\\( ${examGrade} \\times ${examWeightPercentage}\\%`
        let finalGrade = examGrade * (examWeightPercentage / 100)

        assignmentsConsidered.forEach((a) => {
            calculationSteps += ` + ${a.grade} \\times ${a.weight}\\%`
            finalGrade += a.grade * (a.weight / 100)
        })

        calculationSteps += ` = ${Math.round(finalGrade)} \\)`
        finalGrade = Math.round(finalGrade)

        // Check if student passes the course
        let passMessage = ""
        if (examGrade < 60 || finalGrade < 60) {
            passMessage = "You have not passed the course."
        } else {
            passMessage = "You have passed the course."
        }

        // Display the result
        document.getElementById("result").innerText =
            "Final Grade: " + finalGrade + "\n" + passMessage

        // Show the calculation container only when there's a calculation
        calculationContainer.innerHTML =
            '<p><strong>Grade Calculation:</strong></p><p class="math">' +
            calculationSteps +
            "</p>"
        calculationContainer.style.display = "block"
        MathJax.typesetPromise()
    })
})
