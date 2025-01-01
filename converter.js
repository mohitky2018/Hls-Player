const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class HLSConverter {
    constructor(inputFile, outputDir) {
        this.inputFile = inputFile;
        this.outputDir = outputDir;
        this.qualities = [
            { name: '1080p', bitrate: '5000k', resolution: '1920x1080' },
            { name: '720p', bitrate: '2800k', resolution: '1280x720' },
            { name: '480p', bitrate: '1400k', resolution: '854x480' }
        ];
    }

    async convert() {
        // Create output directory
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }

        // Generate variants
        const variantPromises = this.qualities.map(quality => 
            this.convertVariant(quality)
        );

        try {
            await Promise.all(variantPromises);
            this.generateMasterPlaylist();
            console.log('Conversion completed successfully!');
        } catch (error) {
            console.error('Conversion failed:', error);
        }
    }

    convertVariant(quality) {
        return new Promise((resolve, reject) => {
            const outputPath = path.join(this.outputDir, quality.name);
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath, { recursive: true });
            }

            const ffmpegArgs = [
                '-i', this.inputFile,
                '-c:a', 'aac',
                '-c:v', 'h264',
                '-b:v', quality.bitrate,
                '-s', quality.resolution,
                '-f', 'hls',
                '-hls_time', '10',
                '-hls_list_size', '0',
                '-hls_segment_filename', `${outputPath}/segment%d.ts`,
                `${outputPath}/playlist.m3u8`
            ];

            const ffmpeg = spawn('ffmpeg', ffmpegArgs);

            ffmpeg.stderr.on('data', (data) => {
                console.log(`[${quality.name}] ${data}`);
            });

            ffmpeg.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`FFmpeg process exited with code ${code}`));
                }
            });
        });
    }

    generateMasterPlaylist() {
        let masterContent = '#EXTM3U\n#EXT-X-VERSION:3\n';
        
        this.qualities.forEach(quality => {
            masterContent += `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(quality.bitrate) * 1000},RESOLUTION=${quality.resolution}\n`;
            masterContent += `${quality.name}/playlist.m3u8\n`;
        });

        fs.writeFileSync(path.join(this.outputDir, 'master.m3u8'), masterContent);
    }
}

// Usage example
const converter = new HLSConverter(
    '/path/to/input/video.mp4',
    '/path/to/output/hls'
);

converter.convert().catch(console.error);