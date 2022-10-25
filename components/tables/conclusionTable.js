import { useEffect, useState } from 'react';
import { numberOfYears, creditsPerCourse } from '.././utils';
import { Chart } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import Style from './tablesStyle.module.css';

const ConclusionTable = (props) => {

    const [creditsDashboard, setCreditsDashboard] = useState({});
    const [graphColors, setGraphColors] = useState([]);

    useEffect(() => {
        const tableData = props.tableData;
        cumulativeCreditsPerYearCalc(tableData);
        cumulativeCreditsPerCourseCalc(tableData)
    }, [props.tableData]);

    function cumulativeCreditsPerYearCalc(tableData) {
        const creditsPerYear = [];
        let totalCredits = 0;
        for (let y = 1; y <= numberOfYears; y++) {
            const coursesPerYear = tableData.filter((courseData) => courseData.Year === y && courseData.ID != 'COOP');
            creditsPerYear.push({ credits: coursesPerYear.length * creditsPerCourse, year: y });
            totalCredits += coursesPerYear.length * creditsPerCourse;
        }
        setCreditsDashboard(creditsDashboard => ({ ...creditsDashboard, creditsPerYear, totalCredits }));
    }

    function cumulativeCreditsPerCourseCalc(tableData) {
        let creditsPerCourse = [];
        let creditsCalculation = {};
        const coursesByNameList = tableData.map(courseData => courseData.ID);
        coursesByNameList.forEach(name => {
            creditsCalculation[name] = (creditsCalculation[name] || 0) + 3;
        });
        for (const courseName in creditsCalculation) {
            creditsPerCourse.push({ credits: creditsCalculation[courseName], courseName })
        }
        setCreditsDashboard(creditsDashboard => ({ ...creditsDashboard, creditsPerCourse }));
        generateGraphColors(creditsPerCourse.length);
    }

    function generateGraphColors(disiredLength) {
        let colors;
        if (graphColors.length !== 0) {
            if (graphColors.length < disiredLength) {
                const length = disiredLength - graphColors.length;
                colors = getColorsList(length);
                setGraphColors(graphColors => [...graphColors, colors])
            } else if (graphColors.length > disiredLength) {
                setGraphColors(graphColors.slice(0, -1))
            }
        } else {
            colors = getColorsList(disiredLength);
            setGraphColors(colors);
        }
    }

    function getColorsList(length) {
        const rpgaColorList = [];
        for (let i = 0; i < length; i++) {
            rpgaColorList.push(`rgba(${getRandomColorNum(255)}, ${getRandomColorNum(255)}, ${getRandomColorNum(255)}, 0.7)`)
        }
        return rpgaColorList
    }

    function getRandomColorNum(maxColorNum) {
        return Math.floor(Math.random() * maxColorNum);
    }

    const data = {
        labels: creditsDashboard.creditsPerCourse?.map(data => data.courseName),
        datasets: [{
            label: 'Total Credits Per Course',
            backgroundColor: graphColors,
            data: creditsDashboard.creditsPerCourse?.map(data => data.credits),
        },]
    };

    return (
        <div className={Style.credits_dashboard__main_container}>
            <div className={Style.credits_dashboard__inner_container}>
                <table className={Style.table__container}>
                    <thead>
                        <tr>
                            <th>Credits / Year</th>
                            {creditsDashboard.creditsPerYear?.map((creditsData) =>
                                <th className={Style.table__yearTitle}>
                                    {creditsData.year}
                                </th>)}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Per Year</th>
                            {creditsDashboard.creditsPerYear?.map((creditsData) =>
                                <td>
                                    {creditsData.credits}
                                </td>)}
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td colSpan={numberOfYears}>
                                {creditsDashboard.totalCredits}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className={Style.credits_dashboard__inner_container}>
                <Bar data={data}></Bar>
            </div>
        </div>
    );
}

export default ConclusionTable;