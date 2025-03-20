export const Request_Mode = async (slabel, rlabel, req, res) => {
  const userId = req.user._id;
  const { id, type } = req.params;

  const receiver = await User.findById(userId);
  const sender = await User.findById(id);

  if (!receiver || !sender) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Find the follow request in the receiver's action array
  const receiverIndex = receiver.action.findIndex(
    item =>
      item.userId.toString() === id.toString() && item.follow === 'requested'
  );
  const senderIndex = sender.action.findIndex(
    item =>
      item.userId.toString() === userId.toString() && item.follow === 'pending'
  );

  if (receiverIndex === -1 || senderIndex === -1) {
    return res
      .status(400)
      .json({ success: false, message: 'Follow request not found' });
  }

  // Update both users' follow status to "following"
  receiver.action[receiverIndex].follow = rlabel;
  sender.action[senderIndex].follow = slabel;

  await receiver.save();
  await sender.save();
};
