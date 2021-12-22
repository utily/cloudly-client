import { Client } from "./index"

describe("Client", () => {
	it("create", () => {
		expect(Client.create("url", "key")).toMatchObject({ connection: { key: "key", url: "url" } })
	})
})
