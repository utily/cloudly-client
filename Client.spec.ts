import "isomorphic-fetch"
import { Client } from "./index"

describe("Client", () => {
	it("create", () => {
		expect(Client.create("url", "key")).toMatchObject({ client: { key: "key", url: "url" } })
	})
})
