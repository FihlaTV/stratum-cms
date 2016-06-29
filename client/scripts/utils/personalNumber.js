const CURRENT_YEAR = (new Date()).getFullYear();

function isValidSwedishPIN(pin) {
	pin = pin
		.replace(/\D/g, '') // strip out all but digits
		.split('') // convert string to array
		.reverse() // reverse order for Luhn
		.slice(0, 10); // keep only 10 digits (i.e. 1977 becomes 77)

	// verify we got 10 digits, otherwise it is invalid
	if (pin.length !== 10) {
		return false;
	}
	var sum = pin
	// convert to number
		.map(function (n) {
			return Number(n);
		})
	// perform arithmetic and return sum
		.reduce(function (previous, current, index) {
			// multiply every other number with two
			if (index % 2) {
				current *= 2;
			}
			// if larger than 10 get sum of individual digits (also n-9)
			if (current > 9) {
				current -= 9;
			}
			// sum it up
			return previous + current;
		});

	// sum must be divisible by 10
	return 0 === sum % 10;
}

export function isValidPersonalNumber(personalNumber) {
	let matches = personalNumber
		.match(/^(19|20)((\d{2})(\d{2})(\d{2})-{0,1}\d{4})$/);
		
		if(matches){
			let year = parseInt(matches[1] + matches[3], 10);
			return !!(year < CURRENT_YEAR && isValidSwedishPIN(matches[2]));
		} else {
			return false;
		}
}
