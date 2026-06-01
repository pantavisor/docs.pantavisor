# Pantavisor BSP Devices

To use these devices, you will need an already flashed and ready-to-use Pantavisor device. If you don't have one, go to the guide on [how-to prepare your device](choose-device.md).

The BSP for these devices are stored at [releases.json](https://pantavisor-ci.s3.amazonaws.com/meta-pantavisor/releases.json).

## How to update your BSP

Once you have your device ready, you can update its BSP using `pvr merge`. Here is an example for a Raspberry Pi board:

```bash
pvr merge https://pantavisor-ci.s3.amazonaws.com/meta-pantavisor/024/raspberrypi-armv8-scarthgap/pantavisor-bsp-raspberrypi-armv8.pvrexport.tgz
pvr checkout
```

## Latest Stable BSP Releases

<div id="stable-bsp-container">
    <p>Loading latest stable BSP releases...</p>
</div>

<script>
(function() {
    const JSON_URL = 'https://pantavisor-ci.s3.amazonaws.com/meta-pantavisor/releases.json';

    function renderTable(containerId, versionsObj) {
        const container = document.getElementById(containerId);
        if (!versionsObj || Object.keys(versionsObj).length === 0) {
            container.innerHTML = '<p>No BSP releases available at the moment.</p>';
            return;
        }

        const versions = Object.keys(versionsObj)
            .filter(v => v !== 'timestamp')
            .sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));

        if (versions.length === 0) {
            container.innerHTML = '<p>No versioned BSP releases found.</p>';
            return;
        }

        const latestVersion = versions[0];
        const images = versionsObj[latestVersion];

        let html = `<h3>Version: ${latestVersion}</h3>`;
        html += '<div class="md-typeset__table"><table><thead><tr>';
        html += '<th>Device</th><th>BSP (pantavisor)</th><th>SHA256</th>';
        html += '</tr></thead><tbody>';

        let hasBSPs = false;
        images.forEach(img => {
            if (!img.name || !img.bsp) return;
            hasBSPs = true;

            const bspLink = `<a href="${img.bsp.url}">Download</a>`;
            const sha256 = img.bsp.sha256 ? `<code>${img.bsp.sha256}</code>` : 'N/A';

            html += `<tr>
                <td><strong>${img.name}</strong></td>
                <td>${bspLink}</td>
                <td>${sha256}</td>
            </tr>`;
        });

        if (!hasBSPs) {
            container.innerHTML = '<p>No BSP releases found for the latest version.</p>';
            return;
        }

        html += '</tbody></table></div>';
        container.innerHTML = html;
    }

    fetch(JSON_URL)
        .then(response => response.json())
        .then(data => {
            renderTable('stable-bsp-container', data.stable);
        })
        .catch(error => {
            console.error('Error fetching releases:', error);
            document.getElementById('stable-bsp-container').innerHTML = '<p>Error loading BSP releases. Please check your internet connection or try again later.</p>';
        });
})();
</script>
