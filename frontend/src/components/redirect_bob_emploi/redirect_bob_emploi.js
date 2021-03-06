import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { LoaderScreen } from '../shared/loader/loader_screen';
import { subJobLabel } from '../../services/helpers';
import { constants } from '../../constants';

import './redirect_bob_emploi.css';

class RedirectionBobEmploi extends Component {
    constructor(props) {
        super(props);


        this.state = {
            loading: true,
            cityCode: this.props.cityCode,
            romeCode: this.props.romeCode,
            hasError: false,
            url: ''
        }

    }

    componentDidMount() {
        let cityPromise = fetch(`${constants.GET_CITY_SLUG_FROM_CITY_CODE}${this.state.cityCode}`);
        let jobPromise = fetch(`${constants.SUGGEST_JOBS_URL}${this.state.romeCode}`);

        Promise.all([cityPromise, jobPromise])
            .then(responses => { this.computeUrl(responses); this.setState({ loading: false }) })
            .catch(err => this.setState({ hasError: true, loading: false }));
    }

    computeUrl(responses) {
        if(responses[0].status !== 200 || responses[1].status !== 200) {
            this.setState({ hasError: true });
            return;
        }

        let cityDataPromise = responses[0].json();
        let jobDataPromise = responses[1].json();


        Promise.all([cityDataPromise, jobDataPromise])
            .then(datas => {
                try {
                    let city = datas[0].city;
                    let job = datas[1][0];

                    let term = encodeURI(subJobLabel(job.label)).replace(' ','');

                    // URL is : /entreprises/:jobSlugs/:citySlug/:term
                    let url = `/entreprises/${job.occupation}/${city.slug}/${term}`;
                    this.setState({ url });
                } catch(Exception) {
                    this.setState({ hasError: true });
                }
            })
            .catch(err => this.setState({ hasError: true }));
    }

    render() {
        if (this.state.hasError) return <Redirect to="/not-found" noThrow />;
        if (this.state.loading || this.state.url === '') return (<LoaderScreen />);

        return <Redirect to={this.state.url} noThrow />;
    }
}

export default withRouter(({match, location, history}) => <RedirectionBobEmploi
  history={history}
  location={location}
  {...match.params}
   />);
