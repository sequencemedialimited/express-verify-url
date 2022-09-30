import superagent from 'superagent'

import STATUS from '#status'

const {
  FAILURE,
  SUCCESS
} = STATUS

export default function createRender (key = 'url', isWhitelisted = () => false) {
  return async function render (req, res) {
    let {
      query: {
        [key]: url
      } = {}
    } = req

    /**
     *  URL throws either when the data type is invalid or when the string is invalid
     *
     *  (When present in the request query `url` is a string)
     */
    try {
      url = new URL(url).toString()
    } catch (e) {
      const {
        message
      } = e

      return res
        .status(422)
        .json({ status: FAILURE, message: `URL verification failed. Message: "${message}"`, exception: e })
    }

    if (!isWhitelisted(url)) {
      /**
       *  Responses with status codes >= 300 are thrown
       */
      try {
        await superagent.head(url)
      } catch (e) {
        const {
          message,
          status
        } = e

        return res
          .status(422)
          .json({ status: FAILURE, message: `URL verification failed. Message: "${message}" - Status: "${status}"`, exception: e })
      }
    }

    return res
      .status(200)
      .json({ status: SUCCESS })
  }
}
