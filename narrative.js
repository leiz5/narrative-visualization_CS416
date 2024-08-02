document.addEventListener('DOMContentLoaded', function() {
    // Define margin and dimensions
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 200;
    const height = 200;

    let currentScene = 1;

    // Parameters for scenes
    const parameters = {
        scenes: [
            {
                annotation: "Initial scene introducing the data.",
                filter: () => true,
                annotations: [
                    { text: "Initial Data", x: 50, y: 50 }
                ]
            },
            {
                annotation: "Detail view (EngineCylinders > 4).",
                filter: d => +d["EngineCylinders"] > 4,
                annotations: [
                    { text: "Cylinders > 4", x: 100, y: 100 }
                ]
            },
            {
                annotation: "Conclusion (EngineCylinders > 6).",
                filter: d => +d["EngineCylinders"] > 6,
                annotations: [
                    { text: "Cylinders > 6", x: 150, y: 150 }
                ]
            }
        ]
    };

    // Load data from CSV
    d3.csv("https://flunky.github.io/cars2017.csv").then(data => {

        function updateScene(sceneIndex) {
            const scene = parameters.scenes[sceneIndex - 1];
            
            // Create scales
            const xScale = d3.scaleLog()
                .domain([10, 150])
                .range([0, width]);

            const yScale = d3.scaleLog()
                .domain([10, 150])
                .range([height, 0]);

            // Create axis
            const xAxis = d3.axisBottom(xScale)
                .tickValues([10, 20, 50, 100])
                .tickFormat(d3.format("~s"));

            const yAxis = d3.axisLeft(yScale)
                .tickValues([10, 20, 50, 100])
                .tickFormat(d3.format("~s"));

            // Clear previous content
            const chart = d3.select("#chart").html("");

            // Append SVG and translate
            const svg = chart.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis);

            svg.append("g")
                .call(yAxis);

            svg.selectAll("circle")
                .data(data.filter(scene.filter))
                .enter().append("circle")
                .attr("cx", d => xScale(+d["AverageCityMPG"]))
                .attr("cy", d => yScale(+d["AverageHighwayMPG"]))
                .attr("r", d => 2 + (+d["EngineCylinders"]));

            // Add annotations
            svg.selectAll(".annotation")
                .data(scene.annotations)
                .enter().append("text")
                .attr("class", "annotation")
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .text(d => d.text);
        }

        function nextScene() {
            if (currentScene < parameters.scenes.length) {
                currentScene++;
                updateScene(currentScene);
            }
        }

        function previousScene() {
            if (currentScene > 1) {
                currentScene--;
                updateScene(currentScene);
            }
        }

        document.getElementById('next').addEventListener('click', nextScene);
        document.getElementById('previous').addEventListener('click', previousScene);

        // Initialize with the first scene
        updateScene(currentScene);
    });
});
