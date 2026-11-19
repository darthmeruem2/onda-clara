import { estadosBrasileiros, formatCep } from "@lib/util/br-address"
import { HttpTypes } from "@medusajs/types"
import Input from "@modules/common/components/input"
import React, { useState } from "react"
import CountrySelect from "../country-select"

const BillingAddress = ({ cart }: { cart: HttpTypes.StoreCart | null }) => {
  const [formData, setFormData] = useState<Record<string, string>>({
    "billing_address.first_name": cart?.billing_address?.first_name || "",
    "billing_address.last_name": cart?.billing_address?.last_name || "",
    "billing_address.address_1": cart?.billing_address?.address_1 || "",
    "billing_address.address_2": cart?.billing_address?.address_2 || "",
    "billing_address.postal_code": cart?.billing_address?.postal_code || "",
    "billing_address.city": cart?.billing_address?.city || "",
    "billing_address.country_code": cart?.billing_address?.country_code || "br",
    "billing_address.province": cart?.billing_address?.province || "",
    "billing_address.phone": cart?.billing_address?.phone || "",
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name.endsWith(".postal_code") ? formatCep(e.target.value) : e.target.value,
    })
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nome"
          name="billing_address.first_name"
          autoComplete="given-name"
          value={formData["billing_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="billing-first-name-input"
        />
        <Input
          label="Sobrenome"
          name="billing_address.last_name"
          autoComplete="family-name"
          value={formData["billing_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="billing-last-name-input"
        />
        <Input
          label="Rua e número"
          name="billing_address.address_1"
          autoComplete="address-line1"
          value={formData["billing_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="billing-address-input"
        />
        <Input
          label="Bairro e complemento"
          name="billing_address.address_2"
          value={formData["billing_address.address_2"]}
          onChange={handleChange}
          autoComplete="address-line2"
          data-testid="billing-company-input"
        />
        <Input
          label="CEP"
          name="billing_address.postal_code"
          autoComplete="postal-code"
          inputMode="numeric"
          maxLength={9}
          pattern="[0-9]{5}-?[0-9]{3}"
          value={formData["billing_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="billing-postal-input"
        />
        <Input
          label="Cidade"
          name="billing_address.city"
          autoComplete="address-level2"
          value={formData["billing_address.city"]}
          onChange={handleChange}
        />
        <CountrySelect
          name="billing_address.country_code"
          autoComplete="country"
          region={cart?.region}
          value={formData["billing_address.country_code"]}
          onChange={handleChange}
          required
          data-testid="billing-country-select"
        />
        <label className="grid gap-1 text-sm text-ui-fg-subtle">
          Estado (UF)
          <select
            name="billing_address.province"
            autoComplete="address-level1"
            value={formData["billing_address.province"]}
            onChange={handleChange}
            className="min-h-11 rounded-md border border-ui-border-base px-3"
            required
            data-testid="billing-province-input"
          >
            <option value="">Selecione</option>
            {estadosBrasileiros.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
          </select>
        </label>
        <Input
          label="Telefone"
          name="billing_address.phone"
          autoComplete="tel"
          type="tel"
          value={formData["billing_address.phone"]}
          onChange={handleChange}
          data-testid="billing-phone-input"
        />
      </div>
    </>
  )
}

export default BillingAddress
