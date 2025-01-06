import ffmpeg from "fluent-ffmpeg";
import * as path from 'path';

const blurRegion = {
  startTime: 10,
  endTime: 20,
  x: 200,
  y: 150,
  width: 200,
  height: 150,
  blurAmount: 5
};

(async() => {
  try {
    // Your code here
    console.log("Main function executed");
    const inputPath = path.resolve(__dirname, "videos/Bitcoin.mp4");
    const outputPath = path.resolve(__dirname, "videos/Bitcoin.out.mp4");

    ffmpeg(inputPath)
      .complexFilter([
        // These command able to work
        `crop=${blurRegion.width}:${blurRegion.height}:${blurRegion.x}:${blurRegion.y},boxblur=luma_radius=${blurRegion.blurAmount}:chroma_radius=${blurRegion.blurAmount}[crop-blurred];` +
        `[0:v][crop-blurred]overlay=${blurRegion.x}:${blurRegion.y}:enable='between(t,${blurRegion.startTime},${blurRegion.endTime})'[output]`
        // These command work, but not able to blur after a certain time5
        // `trim=start=${blurRegion.startTime}:end=${blurRegion.endTime},setpts=PTS-STARTPTS[trim];` +
        // `[trim]crop=${blurRegion.width}:${blurRegion.height}:${blurRegion.x}:${blurRegion.y},boxblur=luma_radius=${blurRegion.blurAmount}:chroma_radius=${blurRegion.blurAmount}[fg];` +
        // `[0:v][fg]overlay=${blurRegion.x}:${blurRegion.y}:eof_action=pass[output];`
      ])
      .outputOptions('-map', '[output]')
      .outputOptions('-map', '0:a') // Map the audio stream
      .output(outputPath)
      .on("end", () => {
        console.log("Processing finished");
      })
      .on("error", (error) => {
        throw error;
      })
      .run();
  } catch (error) {
    console.error("An error occurred:", error);
  }  
})();