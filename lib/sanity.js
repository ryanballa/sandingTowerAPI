import sanityClient from "@sanity/client";
import dotenv from 'dotenv'

dotenv.config()

const sanity = sanityClient({
    // Find your project ID and dataset in `sanity.json` in your studio project
    projectId: "punnapu4",
    dataset: "production",
    useCdn: false,
    token: process.env.TOKEN
    // useCdn == true gives fast, cheap responses using a globally distributed cache.
    // Set this to false if your application require the freshest possible
    // data always (potentially slightly slower and a bit more expensive).
});

export default sanity;