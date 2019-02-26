import React, { useEffect, useState } from 'react';
import { c } from 'ttag';
import { SubTitle, Block, Label, Table, PrimaryButton, Select, TableHeader, TableRow, useModal, TableBody, useLoading } from 'react-components';
import { connect } from 'react-redux';
import { fetchMembers } from 'proton-shared/lib/state/members/actions';
import { fetchAddresses } from 'proton-shared/lib/api/members';

import AddressModal from './AddressModal';
import AddressActions from './AddressActions';
import AddressStatus from './AddressStatus';

const AddressesSection = ({ addresses, members, fetchMembers }) => {
    const [selectedAddresses, setAddresses] = useState(addresses.data);
    const { loading, loaded, load } = useLoading(addresses.loading);
    const { isOpen: showAddressModal, open: openAddressModal, closeAddressModal } = useModal();
    const membersOptions = members.data.map(({ ID: value, Name: text }) => ({ text, value}));
    const handleChangeMember = async (event) => {
        const memberID = event.target.value;
        const { Addresses } = await api(fetchAddresses(memberID));
        setAddresses(Addresses);
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    return (
        <>
            <SubTitle>{c('Title').t`Addresses`}</SubTitle>
            <Block>
                <Label htmlFor="memberSelect" className="mr1">{c('Label').t`User:`}</Label>
                <Select id="memberSelect" options={membersOptions} className="mr1" onChange={handleChangeMember} />
                <PrimaryButton onClick={openAddressModal}>{c('Action').t`Add address`}</PrimaryButton>
                <AddressModal show={showAddressModal} onClose={closeAddressModal} />
            </Block>
            <Table>
                <TableHeader cells={[
                    c('Header for addresses table').t`Address`,
                    c('Header for addresses table').t`Status`,
                    c('Header for addresses table').t`Actions`
                ]} />
                <TableBody loading={loading}>
                    {selectedAddresses.map((address, index) => {
                        const key = address.ID;
                        return <TableRow key={key} cells={[
                            address.Email,
                            <AddressStatus key={key} address={address} index={index} />,
                            <AddressActions key={key} address={address} index={index} />
                        ]} />;
                    })}
                </TableBody>
            </Table>
        </>
    );
};

const mapStateToProps = ({ addresses, members }) => ({ addresses, members });

const mapDispatchToProps = { fetchMembers };

export default connect(mapStateToProps, mapDispatchToProps)(AddressesSection);