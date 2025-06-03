import { faker } from '@faker-js/faker';

describe('Test goals on Clickup', () => {
  describe('Get Goals', () => {


      it('Should get all goals and return 200', () => {
          cy.getAllGoals()
              .then((response) => {
                  expect(response.status).to.eql(200)
              })
      });

      it('Should get all goals with include_completed and return 200', () => {
          cy.sendRequest('team/90151219267/goal?include_completed=true', 'GET')
              .then((response) => {
                  expect(response.status).to.eql(200)
              })
      });

      it('Should not get all goals with invalid team_id, and return 400', () => {
          cy.sendRequest('team/kjvnhdln/goal', 'GET')
              .then((response) => {
                  expect(response.status).to.eql(400)
              })
      });

      it('Should not get all goals with empty token, and return 400', () => {
          cy.sendEmptyTokenRequest('team/90151219267/goal', 'GET')
              .then((response) => {
                  expect(response.status).to.eql(400)
              })
      });

      it('Should not get all goals with invalid token, and return 401', () => {
          cy.sendInvalidTokenRequest('team/90151219267/goal', 'GET')
              .then((response) => {
                  expect(response.status).to.eql(401)
              })
      });

  })


  describe('Create goal', () => {

      it('Should create goal and return 200', () => {
          cy.createGoal().then((response) => {
              const goalId = response.body.goal.id;


              cy.sendRequest(`goal/${goalId}`, 'GET').then((getResp) => {
                  expect(getResp.status).to.eql(200);
              });


              cy.sendRequest(`goal/${goalId}`, 'DELETE').then((deleteResp) => {
                  expect(deleteResp.status).to.eql(200);
              });
          });
      });


      it('Should not create goal with invalid team_id, and return 400', () => {
          const invalidTeamId = 'invalidTeam123';

          cy.sendRequest(`team/${invalidTeamId}/goal`, 'POST', {
              name: faker.company.name()
          }).then((response) => {
              expect(response.status).to.eql(400);
              expect(response.body.goal).to.be.undefined;
          });
      });


      it('Should not create goal with invalid token, and return 401', () => {
          cy.sendInvalidTokenRequest('team/90151219267/goal', 'POST', {
              name: faker.company.name()
          }).then((response) => {
              expect(response.status).to.eql(401);
              expect(response.body.goal).to.be.undefined;
              })
      });

      it('Should not create goal with no token, and return 400', () => {
          cy.sendEmptyTokenRequest('team/90151219267/goal', 'POST', {
              name: faker.company.name()
          }).then((response) => {
              expect(response.status).to.eql(400);
              expect(response.body.goal).to.be.undefined;
          })
      });

  })

describe('Get goal', () => {

  it('Should get goal and return 200', () => {
    cy.createGoal().then((response) => {
      const goalId = response.body.goal.id;


      cy.sendRequest(`goal/${goalId}`, 'GET').then((getResp) => {
        expect(getResp.status).to.eql(200);
      });


      cy.sendRequest(`goal/${goalId}`, 'DELETE').then((deleteResp) => {
        expect(deleteResp.status).to.eql(200);
      });
    });
  });


  it('Should not get goal with invalid token, and return 401', () => {
    cy.createGoal().then((response) => {
      const goalId = response.body.goal.id;

      cy.sendInvalidTokenRequest(`goal/${goalId}`, 'GET')
          .then((response) => {
            expect(response.status).to.eql(401);
            expect(response.body.goal).to.be.undefined;
          })

      cy.sendRequest(`goal/${goalId}`, 'DELETE').then((deleteResp) => {
        expect(deleteResp.status).to.eql(200);
      });
    })
  });

  it('Should not get goal with no token, and return 400', () => {
    cy.createGoal().then((response) => {
      const goalId = response.body.goal.id;

    cy.sendEmptyTokenRequest(`goal/${goalId}`, 'GET')
        .then((response) => {
          expect(response.status).to.eql(400);
          expect(response.body.goal).to.be.undefined;
        })

      cy.sendRequest(`goal/${goalId}`, 'DELETE').then((deleteResp) => {
        expect(deleteResp.status).to.eql(200);
      });
  })
});

  it('Should not get goal with empty id, and return 404', () => {
    cy.createGoal().then((response) => {
      const goalId = response.body.goal.id;

      cy.sendRequest('goal/', 'GET')
          .then((response) => {
            expect(response.status).to.eql(404);
            expect(response.body.goal).to.be.undefined;
          })

      cy.sendRequest(`goal/${goalId}`, 'DELETE').then((deleteResp) => {
        expect(deleteResp.status).to.eql(200);
      });
    })
  });

})

  describe('Update goal', () => {

    it('Should update goal name', () => {
      const newName = faker.company.name();

      cy.createGoal().then((response) => {
        const goalId = response.body.goal.id;

        cy.sendRequest(`goal/${goalId}`, 'PUT', {
          name: newName
        }).then((response) => {
          expect(response.status).to.eql(200);
        });

        cy.sendRequest(`goal/${goalId}`, 'GET').then((response) => {
          expect(response.status).to.eql(200);
          expect(response.body.goal.name).to.eql(newName);
        })

        cy.sendRequest(`goal/${goalId}`, 'DELETE').then((response) => {
          expect(response.status).to.eql(200);
        });
      })
    });

    it('Should update goal description', () => {
      const newDesc = faker.company.catchPhrase() ;

      cy.createGoal().then((response) => {
        const goalId = response.body.goal.id;

        cy.sendRequest(`goal/${goalId}`, 'PUT', {
          description: newDesc
        }).then((response) => {
          expect(response.status).to.eql(200);
        });

        cy.sendRequest(`goal/${goalId}`, 'GET').then((response) => {
          expect(response.status).to.eql(200);
          expect(response.body.goal.description).to.eql(newDesc);
        })

        cy.sendRequest(`goal/${goalId}`, 'DELETE').then((response) => {
          expect(response.status).to.eql(200);
        });
      })
    });

    it('Should not update goal with invalid token, and return 401', ()  => {

      cy.createGoal().then((response) => {
        const goalId = response.body.goal.id;
        const originalDescription = response.body.goal.description;

        cy.sendInvalidTokenRequest(`goal/${goalId}`, 'PUT', {
          description: 'New Description'
        }).then((invalidUpdateResp) => {
          expect(invalidUpdateResp.status).to.eql(401);

          cy.sendRequest(`goal/${goalId}`, 'GET').then((getResp) => {
            expect(getResp.status).to.eql(200);
            expect(getResp.body.goal.description).to.eql(originalDescription);


            cy.sendRequest(`goal/${goalId}`, 'DELETE').then((deleteResp) => {
              expect(deleteResp.status).to.eql(200);
            });
          });
        });
      });
    });

    it('Should not update goal with no token, and return 400', ()  => {

      cy.createGoal().then((response) => {
        const goalId = response.body.goal.id;
        const originalDescription = response.body.goal.description;

        cy.sendEmptyTokenRequest(`goal/${goalId}`, 'PUT', {
          description: 'New description2'
        }).then((invalidUpdateResp) => {
          expect(invalidUpdateResp.status).to.eql(400);

          cy.sendRequest(`goal/${goalId}`, 'GET').then((getResp) => {
            expect(getResp.status).to.eql(200);
            expect(getResp.body.goal.description).to.eql(originalDescription);


            cy.sendRequest(`goal/${goalId}`, 'DELETE').then((deleteResp) => {
              expect(deleteResp.status).to.eql(200);
            });
          });
        });
      });
    });

    it('Should not update goal with invalid goal_id, and return 404', ()  => {

      cy.createGoal().then((response) => {
        const goalId = response.body.goal.id;
        const OriginName = response.body.goal.name;

        cy.sendRequest('goal/0c5fbcc8-4b1a-4563-9cee-5a9662985f2b', 'PUT', {
          name: 'New name'
        }).then((invalidUpdateResp) => {
          expect(invalidUpdateResp.status).to.eql(404);

          cy.sendRequest(`goal/${goalId}`, 'GET').then((getResp) => {
            expect(getResp.status).to.eql(200);
            expect(getResp.body.goal.name).to.eql(OriginName);


            cy.sendRequest(`goal/${goalId}`, 'DELETE').then((deleteResp) => {
              expect(deleteResp.status).to.eql(200);
            });
          });
        });
      });
    });

  })

describe('Delete goal', () => {

  it('Should delete goal', () => {
            cy.createGoal().then((response) => {
                const goalId = response.body.goal.id;


                cy.sendRequest(`goal/${goalId}`, 'GET').then((getResp) => {
                    expect(getResp.status).to.eql(200);
                });


                cy.sendRequest(`goal/${goalId}`, 'DELETE').then((deleteResp) => {
                    expect(deleteResp.status).to.eql(200);
                });
            });
        });

  it('Should not delete goal with invalid id, and return 404', () => {
    cy.createGoal().then((response) => {
      const goalId = response.body.goal.id;


      cy.sendRequest(`goal/${goalId}`, 'GET').then((getResp) => {
        expect(getResp.status).to.eql(200);
      });


      cy.sendRequest(`goal/0c5fbcc8-4b1a-4563-9cee-5a9662985f2b`, 'DELETE').then((deleteResp) => {
        expect(deleteResp.status).to.eql(404);
        expect(deleteResp.body.goal).to.be.undefined;
      });
    });
  });

  it('Should not delete goal with invalid token, and return 401', () => {
    cy.createGoal().then((response) => {
      const goalId = response.body.goal.id;


      cy.sendRequest(`goal/${goalId}`, 'GET').then((getResp) => {
        expect(getResp.status).to.eql(200);
      });


      cy.sendInvalidTokenRequest(`goal/${goalId}`, 'DELETE').then((deleteResp) => {
        expect(deleteResp.status).to.eql(401);
        expect(deleteResp.body.goal).to.be.undefined;
      });
    });
  });

  it('Should not delete goal with no token, and return 400', () => {
    cy.createGoal().then((response) => {
      const goalId = response.body.goal.id;


      cy.sendRequest(`goal/${goalId}`, 'GET').then((getResp) => {
        expect(getResp.status).to.eql(200);
      });


      cy.sendEmptyTokenRequest(`goal/${goalId}`, 'DELETE').then((deleteResp) => {
        expect(deleteResp.status).to.eql(400);
        expect(deleteResp.body.goal).to.be.undefined;
      });
    });
  });

})

})