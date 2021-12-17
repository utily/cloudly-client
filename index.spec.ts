import { Client } from "./index"

describe("cloudly-client", () => {
	it("create", () => {
		expect(Client.create("server", "key")).toMatchObject({ connection: { key: "key", server: "server" } })
	})
})
