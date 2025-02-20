import Layout from "../components/Layout";
import {team} from "../utils/team";
import classes from "./styles/Team.module.scss";
import Image from "next/image";

function TeamPage() {
    return (
        <Layout>
            <div className={classes.root}>
                {team.map((member, i) => (
                    <div key={`member-card-${i}`} className={classes.card}>
                        <Image
                            src={`/images/${member.image}`}
                            alt={member.name}
                            width={70}
                            height={74}
                            layout="responsive"
                        />
                        <div className={classes.content}>
                            {member.name ? <div className={classes.title}>{member.name}</div> : null}
                            {member.social?.map(({name, url}, j) => (
                                <div key={`social-${i}-${j}`} className={classes.social}>
                                    <a href={url} target="_blank">
                                        {name}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}

export default TeamPage;
