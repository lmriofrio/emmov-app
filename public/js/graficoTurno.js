document.addEventListener("DOMContentLoaded", function () {
    var chart = echarts.init(document.getElementById("graficoTurno"));
  
    var option = {
      series: [
        {
          type: "pie",
          radius: ["70%", "90%"],
          silent: true,
          data: [
            { value: 100, itemStyle: { color: "#327cf8" } },
            { value: 0, itemStyle: { color: "#007bff" } }
          ],
          label: { show: false }
        }
      ]
    };
  
    chart.setOption(option);
  });

  document.addEventListener("DOMContentLoaded", function () {
    var chart = echarts.init(document.getElementById("graficoTurnoRTV"));
  
    var option = {
      series: [
        {
          type: "pie",
          radius: ["70%", "90%"],
          silent: true,
          data: [
            { value: 100, itemStyle: { color: "#327cf8" } },
            { value: 0, itemStyle: { color: "#007bff" } }
          ],
          label: { show: false }
        }
      ]
    };
  
    chart.setOption(option);
  });
  
  