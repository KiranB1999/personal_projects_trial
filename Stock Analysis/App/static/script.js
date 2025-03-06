$(document).ready(function() {
    function updateData() {
        $.get('/api/stock-data', function(data) {
            // Update chart
            Plotly.newPlot('chart', JSON.parse(data.chart));

            // Update statistics
            $('#current-price').text('₹' + data.stats.current_price.toFixed(2));
            $('#daily-change').text(data.stats.daily_change.toFixed(2) + '%')
                .removeClass('text-success text-danger')
                .addClass(data.stats.daily_change >= 0 ? 'text-success' : 'text-danger');
            $('#rsi').text(data.stats.rsi.toFixed(2));
            $('#signal').text(data.stats.signal)
                .removeClass('text-success text-danger')
                .addClass(data.stats.signal === 'Buy' ? 'text-success' : 'text-danger');

            // Update recent data table
            $('#recent-data').empty();
            data.recent_data.forEach(function(row) {
                $('#recent-data').append(`
                    <tr>
                        <td>${new Date(row.Date).toLocaleDateString()}</td>
                        <td>${row.Open.toFixed(2)}</td>
                        <td>${row.High.toFixed(2)}</td>
                        <td>${row.Low.toFixed(2)}</td>
                        <td>${row.Close.toFixed(2)}</td>
                        <td>${row.Volume.toLocaleString()}</td>
                        <td>${row.RSI.toFixed(2)}</td>
                        <td>${row.K.toFixed(2)}</td>
                        <td>${row.D.toFixed(2)}</td>
                    </tr>
                `);
            });
        });
    }

    // Initial update
    updateData();

    // Update every 5 minutes
    setInterval(updateData, 5 * 60 * 1000);
}); 