const validateBody = (validateDto) => (req, res, next) => {
    const { error, value } = validateDto.validate(req.body, {
        stripUnknown: true,
        allowUnknown: true,
        abortEarly: false
    })

    if (!!error?.details?.length) {
        // console.log(error.details.message)
        res.status(400).json({
            errors: error?.details.reduce((errors, curr) =>
                ({ ...errors,[curr.context.key]: curr.message.replace(/"/g, '')}),
                {}),
            "status": "fail",
            "statusCode": 400,
        })
          
        return;
    }
    req.body = value
    next()
}

module.exports = {validateBody}