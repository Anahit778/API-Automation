import {faker} from '@faker-js/faker';

describe('Test Restful-booker APIs', () => {
    const loginCreds = {
        "username": "admin",
        "password": "password123"
    }
    let token
    let bookingId

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    it('Login', () => {

        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/auth',
            body: loginCreds
        }).then((response) => {
            expect(response.status).to.eql(200);
            expect(response.body).to.have.property('token')
            let token = response.body.token;
        })
    })


    it('Create Booking', () => {

        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/booking',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {
                "firstname": firstName,
                "lastname": lastName,
                "totalprice": 111,
                "depositpaid": true,
                "bookingdates": {
                    "checkin": "2018-01-01",
                    "checkout": "2019-01-01"
                },
                "additionalneeds": "Breakfast"
            }
        }).then((response) => {
            expect(response.status).to.eql(200);
            expect(response.body.booking).to.have.property('firstname');
            expect(response.body.booking).to.have.property('lastname');
            expect(response.body.booking.firstname).to.eql(firstName);
            expect(response.body.booking.lastname).to.eql(lastName);
            bookingId = response.body.bookingid;
        })

    })


    it('Get Booking', () => {

        cy.request({
            method: 'GET',
            url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
            headers: {
                Authorization: `Bearer ${token}`
            },

        }).then((response) => {
            expect(response.status).to.eql(200);
            expect(response.body).to.have.property('firstname');
            expect(response.body).to.have.property('lastname');
            expect(response.body.firstname).to.be.a('string').and.not.be.empty;
            expect(response.body.lastname).to.be.a('string').and.not.be.empty;
            expect(response.body.firstname).to.eql(firstName);
            expect(response.body.lastname).to.eql(lastName);
            cy.wrap(response.body.additionalneeds).should('equal', 'Breakfast');

        })

    })

})