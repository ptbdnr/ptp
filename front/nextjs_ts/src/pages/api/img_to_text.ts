import type { NextApiRequest, NextApiResponse } from 'next'

import { Mistral } from "@mistralai/mistralai";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const mistralModelName = process.env["MISTRAL_MODEL_NAME"];
const mistralApiKey = process.env["MISTRAL_API_KEY"];
if (!mistralModelName || !mistralApiKey) {
    throw new Error("Mistral model name or API key is not defined");
}

const s3Hostname = process.env["VULTR_OBJECT_STORAGE_HOSTNAME"];
const s3AccessKey = process.env["VULTR_OBJECT_STORAGE_ACCESS_KEY"];
const s3SecretAccessKey = process.env["VULTR_OBJECT_STORAGE_SECRET_KEY"];
const s3BucketName = process.env["VULTR_OBJECT_STORAGE_BUCKET_NAME_INGREDIENT_IMAGES"];
if (!s3Hostname || !s3AccessKey || !s3SecretAccessKey || !s3BucketName) {
    throw new Error("S3 credentials are not defined");
}

type ResponseData = {
    error?: string;
    content?: string;
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    const func_name = 'img_to_text';
    if (req.method === 'POST') {
        console.log(`POST API /${func_name}`);
        try {
            // Validate that req.body.image is provided and not null
            if (!req.body.image) {
                res.status(400).send({ error: 'No image data provided.' });
                return;
            }
            // res.status(200).send({ content: 'a lollipop' });
            byte64_to_s3(req.body.image).then((url) => {
                console.log("Image URL:", url);
                mistral_vision(url).then((content) => {
                    console.log("Content:", content);
                    res.status(200).send({ content: content });
                })
            });
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send({ error: 'failed to fetch data' });
            return;
        }
    }
    
    console.error(`API /${func_name} does not support ${req.method}`);
    res.status(405).send({ error: `API /${func_name} does not support ${req.method}` });
}

async function byte64_to_s3(image: string) {
    // Validate the image explicitely to ensure it's not null
    if (!image) {
        throw new Error("No image data provided.");
    }

    const s3_client = new S3Client({
        endpoint: `https://${s3Hostname}`,
        credentials: {
            accessKeyId: s3AccessKey!,
            secretAccessKey: s3SecretAccessKey!,
        }
    })

    const objectKey = `${uuidv4()}.jpg`;

    const uploadParams = {
        Bucket: s3BucketName,
        Key: objectKey,
        Body: Buffer.from(image, 'base64'), // Assuming the image is a base64 string
        ContentType: "image/png",
    };

    await s3_client.send(new PutObjectCommand(uploadParams));

    const imageUrl = `https://${s3Hostname}/${objectKey}`;
    console.log("Image uploaded to S3:", imageUrl);
    return imageUrl;
}

async function mistral_vision(imageUrl: string) {

    const mistral_client = new Mistral({ apiKey: mistralApiKey });
    const prompt = "List the edible objects in this image and provide the quantity for each? Example: rice 500g, lollipop 2 pieces"
    const chatResponse = await mistral_client.chat.complete({
        model: mistralModelName!,
        messages: [
            {
            role: "user",
            content: [
                { type: "text", text: prompt },
                {
                    type: "image_url",
                    imageUrl: imageUrl,
                },
            ],
            },
        ],
    });

    const choices = chatResponse?.choices;
    if (!choices || choices.length === 0) {
        console.error("No choices found in the response");
        return;
    };
    console.log("Response choices:", choices);
    // Get the first choice
    const message = choices[0].message;
    if (!message) {
        console.error("No message found in the response");
        return;
    };
    console.log("Response message:", message);
    // Get the content of the message
    const content = message.content;
    if (!content) {
        console.error("No content found in the message");
        return;
    };
    return `${content}`;
}