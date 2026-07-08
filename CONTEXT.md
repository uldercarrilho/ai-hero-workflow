# Measurement Conversion

A web application that transforms values expressed in one physical unit into an equivalent value in another unit within the same quantity.

## Language

**Quantity**:
A measurable physical dimension — length, mass, volume, temperature, speed, or area — that groups units which can be converted into one another.
_Avoid_: Category, dimension type, measurement type

**Catalog**:
The quantities and units currently available for conversion. Initially length, mass, volume, and temperature.
_Avoid_: Unit list, supported types

**Value**:
The numeric amount on one side of a paired conversion, expressed in the selected unit.
_Avoid_: Reading, measurement, number

**Invalid value**:
A non-numeric or unparseable entry. The app shows an inline error and does not update the other side.
_Avoid_: Bad input, NaN

**Unit**:
A named scale for expressing a quantity (e.g. meter, kilogram, US gallon).
_Avoid_: Measure, metric

**Conversion**:
The computation of an equivalent value in a different unit within the same quantity.
_Avoid_: Translation, transform, calculation

**Paired conversion**:
A conversion presented as two linked unit fields; the user may edit either side and the other recomputes to maintain equivalent magnitude.
_Avoid_: Two-way converter, dual input

**Swap**:
Exchanges the units and values on both sides of a paired conversion.
_Avoid_: Flip, reverse, switch

**Display precision**:
The number of digits shown on the computed side of a paired conversion, derived from the precision of the value the user entered.
_Avoid_: Rounding mode, decimal places

**Shareable conversion**:
A paired conversion whose quantity, units, and value are encoded in the URL so it can be bookmarked or sent to another person.
_Avoid_: Deep link, permalink

**Default conversion**:
The paired conversion shown on first visit when the URL carries no state — length, kilometers on one side and miles on the other, with no value entered.
_Avoid_: Initial state, homepage conversion

**Quantity default**:
The default unit pair for a quantity when the user switches to it or lands without URL state. Length: kilometers and miles. Mass: kilograms and pounds. Volume: liters and US gallons. Temperature: Celsius and Fahrenheit.
_Avoid_: Preset, default units
