
export default async function HeaderApi() {
    let applicationName = '';
    let applicationLogo = '';
    let applicationImage = '';
    let applicationDescription = '';

    await fetch(`${process.env.NEXT_PUBLIC_RESTFUL_API}/configuration?name[]=application_name&name[]=application_logo&name[]=application_image&name[]=application_description`, {
        method: 'GET',
    }).then(async (res) => {
        const data = await res.json()

        if (data?.length > 0) {
            data.map((val) => {
                if (val.name === 'application_name') applicationName = val.value;
                if (val.name === 'application_logo') applicationLogo = val.value;
                if (val.name === 'application_image') applicationImage = val.value;
                if (val.name === 'application_description') applicationDescription = val.value;
            })
        }
    }).catch((err) => {
        console.error(err)
    })

}
