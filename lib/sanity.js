import sanityClient from "@sanity/client";

const sanity = sanityClient({
    // Find your project ID and dataset in `sanity.json` in your studio project
    projectId: "punnapu4",
    dataset: "production",
    useCdn: false,
    token: 'skYBe56FqxiEb6XjBUirHVKlw2iwX7GVqXPvYmEDHhqAU31rIcui2rSmehkkWhW8mnTI9O18NKpXIg59HnnW4MB2v1gw2CB4EihZlcsP5k4PknikoO0TsVPtUVlBqzHIj1NkJsoRhCAjYNyPFxCJoNPK6ls3AnwNvca0W5nIduSCtZOSIfAg'
    // useCdn == true gives fast, cheap responses using a globally distributed cache.
    // Set this to false if your application require the freshest possible
    // data always (potentially slightly slower and a bit more expensive).
});

export default sanity;